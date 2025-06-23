const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const addPurchase = async (req, res) => {
    try {
        const { supplier_id, items } = req.body;
        const created_by_id = req.user.id;

        if (!supplier_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing supplier or items' });
        }

        // Create the purchase with nested items
        const purchase = await prisma.purchase.create({
            data: {
                supplier_id,
                created_by_id,
                items: {
                    create: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        cost_price: item.cost_price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return res.status(201).json(purchase);
    } catch (error) {
        console.error('Failed to add purchase:', error);
        return res.status(500).json({ error: 'Failed to add purchase' });
    }
};


const getAllPurchase = async (req, res) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                archived: false,
                deleted_at: null,
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                supplier: true,
                created_by: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return res.status(200).json(purchases);
    } catch (error) {
        console.error('Failed to fetch purchases:', error);
        return res.status(500).json({ error: 'Failed to fetch purchases' });
    }
};

module.exports = {
    addPurchase,
    getAllPurchase,
};
