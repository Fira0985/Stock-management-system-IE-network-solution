const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all non-archived purchases (with supplier and item details)
const getAllPurchase = async (req, res) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: { archived: false },
            orderBy: { created_at: 'desc' },
            include: {
                supplier: true,
                created_by: {
                    select: { username: true }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                cost_price: true,
                                unit: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({ success: true, data: purchases });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Add new purchase (supplier ID, items[], created_by from token)
const addPurchase = async (req, res) => {
    const { supplier_id, items } = req.body;
    const userId = req.user.id;

    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid request payload' });
    }

    try {
        const purchase = await prisma.purchase.create({
            data: {
                supplier: { connect: { id: supplier_id } },
                created_by: { connect: { id: userId } },
                items: {
                    create: items.map(item => ({
                        product: { connect: { id: item.product_id } },
                        quantity: item.quantity,
                        cost_price: item.cost_price
                    }))
                }
            },
            include: {
                supplier: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        for (const item of items) {
            await prisma.product.update({
                where: { id: item.product_id },
                data: {
                    unit: {
                        increment: item.quantity
                    }
                }
            });
        }


        return res.status(201).json({ success: true, data: purchase });
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    getAllPurchase,
    addPurchase
};
