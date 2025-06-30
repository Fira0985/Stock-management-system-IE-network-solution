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
        payment_status = 'UNPAID',
        customer_id = null,
        items = [],
    } = req.body;

    const created_by_id = req.user.id;

    try {
        const parsedTotal = parseFloat(total);
        const parsedDiscount = parseFloat(discount_amount);
        const parsedPaid = parseFloat(paid_amount);
        const parsedBalance = parseFloat(balance_due);


        if (!type || isNaN(parsedTotal) || items.length === 0) {
            return res.status(400).json({ error: 'Missing or invalid required sale data.' });
        }

        // Validate customer (optional)
        if (customer_id !== null) {
            const customer = await prisma.nonUser.findUnique({ where: { id: parseInt(customer_id) } });

            if (type == "CREDIT") {
                if(parsedBalance > customer.credit_limit) {
                    return res.status(400).json({
                        error: `Credit limit exceeded for customer ID ${customer_id}. Limit: ${customer.credit_limit}, Requested: ${parsedBalance}`,
                    });
                }
            }
            if (!customer || customer.type !== 'CUSTOMER') {
                return res.status(400).json({ error: 'Invalid customer ID.' });
            }
        }

        // Fetch products and prepare sale items
        const parsedItems = [];
        for (const item of items) {
            const product_id = parseInt(item.product_id);
            const quantity = parseInt(item.quantity);

            if (!product_id || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid item data.' });
            }

            const product = await prisma.product.findUnique({ where: { id: product_id } });

            if (!product || product.archived) {
                return res.status(404).json({ error: `Product with ID ${product_id} not found or archived.` });
            }

            const availableStock = parseInt(product.unit);
            if (availableStock < quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for '${product.name}'. Available: ${availableStock}, Requested: ${quantity}`,
                });
            }

            parsedItems.push({
                product_id,
                quantity,
                unit_price: parseFloat(product.sale_price), // use DB value
            });
        }

        // Create sale transaction
        const sale = await prisma.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    type,
                    total: parsedTotal,
                    discount_amount: parsedDiscount,
                    paid_amount: parsedPaid,
                    balance_due: parsedBalance,
                    due_date: due_date ? new Date(due_date) : null,
                    payment_status,
                    customer_id: customer_id ? parseInt(customer_id) : null,
                    created_by_id,
                    items: {
                        create: parsedItems,
                    },
                    payments: parsedPaid > 0
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
                },
            });

           // If the sale is a credit sale, update customer credit 
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

            // Deduct stock
            for (const item of parsedItems) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: {
                        unit: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newSale;
        });

        res.status(201).json({ message: 'Sale successfully created', sale });

    } catch (error) {
        console.error('Error adding sale:', error);
        res.status(500).json({ error: 'Failed to add sale', details: error.message });
    }
};

module.exports = {
    getAllSales,
    addSales,
};