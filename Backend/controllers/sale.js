const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all sales (excluding archived ones)
 */
const getAllSales = async (req, res) => {
    try {
        // Extract parameters from req.query instead of req.body
        const { startDate, endDate } = req.query;

        // Build date filter if both dates are provided and valid
        let dateFilter = {};
        if (startDate && endDate) {
            // Parse the dates
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            // Validate parsed dates
            if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
                dateFilter = {
                    created_at: {
                        gte: parsedStartDate,
                        lte: parsedEndDate,
                    },
                };
            } else {
                return res.status(400).json({ error: 'Invalid date format for startDate or endDate.' });
            }
        }

        const sales = await prisma.sale.findMany({
            where: {
                archived: false,
                ...dateFilter,
            },
            include: {
                customer: true,
                created_by: true,
                deleted_by: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        res.status(200).json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
};

/**
 * Add new sale along with sale items and optional initial payment
 */

const addSales = async (req, res) => {
    const {
        type,
        total,
        discount_amount = 0,
        paid_amount = 0,
        balance_due,
        due_date,
        customer_id = null,
        items = [],
    } = req.body;

    const created_by_id = req.user.id;

    try {
        const parsedTotal = parseFloat(total);
        const parsedDiscount = parseFloat(discount_amount) || 0;
        const parsedPaid = parseFloat(paid_amount) || 0;
        const parsedBalance = parseFloat(balance_due) || 0;

        if (!type || isNaN(parsedTotal) || items.length === 0) {
            return res
                .status(400)
                .json({ error: 'Missing or invalid required sale data.' });
        }

        if (isNaN(parsedDiscount) || isNaN(parsedPaid) || isNaN(parsedBalance)) {
            return res.status(400).json({ error: 'Invalid numeric values in sale data.' });
        }

        // Validate customer (optional)
        let customer = null;
        if (customer_id !== null) {
            if (customer_id === '' || customer_id === undefined) {
                return res.status(400).json({ error: 'Invalid customer ID.' });
            }

            customer = await prisma.nonUser.findUnique({
                where: { id: parseInt(customer_id) },
            });

            if (!customer || customer.type !== 'CUSTOMER') {
                return res.status(400).json({ error: 'Invalid customer ID.' });
            }

            if (type === 'CREDIT') {
                if (parsedBalance > customer.credit_limit) {
                    return res.status(400).json({
                        error: `Credit limit exceeded for customer ID ${customer_id}. Limit: ${customer.credit_limit}, Requested: ${parsedBalance}`,
                    });
                }
            }
        }

        // Fetch products and prepare sale items
        const productQuantities = new Map();

        for (const item of items) {
            const product_id = parseInt(item.product_id);
            const quantity = parseInt(item.quantity);

            if (!product_id || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid item data.' });
            }

            productQuantities.set(
                product_id,
                (productQuantities.get(product_id) || 0) + quantity
            );
        }

        const uniqueProductIds = Array.from(productQuantities.keys());
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: uniqueProductIds,
                },
            },
        });

        if (products.length !== uniqueProductIds.length) {
            const foundIds = new Set(products.map((p) => p.id));
            const missingIds = uniqueProductIds.filter((id) => !foundIds.has(id));
            return res.status(404).json({
                error: `Products not found: ${missingIds.join(', ')}.`,
            });
        }

        const productMap = new Map(products.map((product) => [product.id, product]));
        const parsedItems = [];

        for (const item of items) {
            const product_id = parseInt(item.product_id);
            const quantity = parseInt(item.quantity);
            const product = productMap.get(product_id);

            if (!product || product.archived) {
                return res.status(400).json({
                    error: `Product '${product?.name || product_id}' is unavailable or archived.`,
                });
            }

            parsedItems.push({
                product_id,
                quantity,
                unit_price: Number(product.sale_price),
            });
        }

        for (const product of products) {
            const requestedQuantity = productQuantities.get(product.id) || 0;
            const availableStock = Number(product.unit || 0);
            if (availableStock < requestedQuantity) {
                return res.status(400).json({
                    error: `Insufficient stock for '${product.name}'. Available: ${availableStock}, Requested: ${requestedQuantity}`,
                });
            }
        }

        // Create sale transaction
        const sale = await prisma.$transaction(
            async (tx) => {
                const newSale = await tx.sale.create({
                    data: {
                        type,
                        total: parsedTotal,
                        discount_amount: parsedDiscount,
                        paid_amount: parsedPaid,
                        balance_due: parsedBalance,
                        due_date: due_date ? new Date(due_date) : null,
                        payment_status: (() => {
                            if (parsedPaid === 0) return 'UNPAID';
                            if (parsedPaid < parsedTotal) return 'PARTIAL';
                            return 'PAID';
                        })(),
                        customer_id: customer_id ? parseInt(customer_id) : null,
                        created_by_id,
                        items: {
                            create: parsedItems,
                        },
                        payments:
                            parsedPaid > 0
                                ? {
                                    create: {
                                        amount: parsedPaid,
                                        paid_at: new Date(),
                                        created_by_id,
                                    },
                                }
                                : undefined,
                    },
                    include: {
                        items: true,
                        payments: true,
                        created_by: true,
                        customer: true,
                    },
                });

                // If credit sale, reduce customer's credit_limit
                if (type === 'CREDIT' && customer_id) {
                    await tx.nonUser.update({
                        where: { id: parseInt(customer_id) },
                        data: {
                            credit_limit: {
                                decrement: parsedBalance,
                            },
                        },
                    });
                }

                // Deduct stock for each product once, with safe conditional update
                const productEntries = Array.from(productQuantities.entries());
                const updateResults = await Promise.all(
                    productEntries.map(([productId, totalQuantity]) =>
                        tx.product.updateMany({
                            where: {
                                id: productId,
                                unit: {
                                    gte: totalQuantity,
                                },
                            },
                            data: {
                                unit: {
                                    decrement: totalQuantity,
                                },
                            },
                        })
                    )
                );

                for (let i = 0; i < updateResults.length; i++) {
                    if (updateResults[i].count === 0) {
                        const [productId] = productEntries[i];
                        const product = productMap.get(productId);
                        throw new Error(`Insufficient stock for '${product?.name || productId}'.`);
                    }
                }

                return newSale;
            },
            { timeout: 20000 }
        );

        // ────────── SOCKET.IO EMIT ──────────
        const io = req.app.get("io"); // get Socket.IO instance
        if (io) {
            const activity = {
                type: "SALE",
                id: sale.id,
                by: sale.created_by?.username || "Unknown",
                at: sale.created_at,
                customer: sale.customer?.name || null,
                total: sale.total,
            };
            io.emit("recentActivity", [activity]); // notify all online users
        }

        res.status(201).json({ message: 'Sale successfully created', sale });
    } catch (error) {
        console.error('Error adding sale:', error);
        // If transaction threw due to insufficient stock, surface a 400 with the specific message
        if (error && error.message && error.message.toLowerCase().includes('insufficient stock')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add sale', details: error.message });
    }
};


module.exports = { addSales };


module.exports = {
    getAllSales,
    addSales,
};