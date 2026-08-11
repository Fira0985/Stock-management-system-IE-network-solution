const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                error: "Email required",
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        // Get recent sales
        const sales = await prisma.sale.findMany({
            where: {
                created_by_id: user.id,
                archived: false,
                deleted_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
            take: 10,
        });

        // Get recent purchases
        const purchases = await prisma.purchase.findMany({
            where: {
                created_by_id: user.id,
                archived: false,
                deleted_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
            take: 10,
        });

        // Get recent payments
        const payments = await prisma.payment.findMany({
            where: {
                created_by_id: user.id,
                deleted_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
            take: 10,
        });

        /*
         * Convert database records into notifications.
         */
        const notifications = [
            ...sales.map((sale) => ({
                notificationId: `sale-${sale.id}`,
                type: "Sale",
                description: `Sale #${sale.id} created`,
                at: sale.created_at,
                by: user.username,
            })),

            ...purchases.map((purchase) => ({
                notificationId: `purchase-${purchase.id}`,
                type: "Purchase",
                description: `Purchase #${purchase.id} created`,
                at: purchase.created_at,
                by: user.username,
            })),

            ...payments.map((payment) => ({
                notificationId: `payment-${payment.id}`,
                type: "Payment",
                description: `Payment #${payment.id} of ${payment.amount} created`,
                at: payment.created_at,
                by: user.username,
            })),
        ];

        // Sort all notification types by newest first
        notifications.sort(
            (a, b) =>
                new Date(b.at) - new Date(a.at)
        );

        // Return newest 5 notifications
        res.json(
          notifications.slice(0, 5)
        ) ;

    } catch (err) {
        console.error(
            "Failed to fetch notifications:",
            err
        );

        res.status(500).json({
            error: "Failed to fetch notifications",
        });
    }
};