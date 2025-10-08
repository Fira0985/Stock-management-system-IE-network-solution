const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch recent sales, purchases, and payments created by this user
    const sales = await prisma.sale.findMany({
      where: { created_by_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const purchases = await prisma.purchase.findMany({
      where: { created_by_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const payments = await prisma.payment.findMany({
      where: { created_by_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    // Normalize notifications
    const notifications = [
      ...sales.map(sale => ({
        type: 'Sale',
        description: `Sale #${sale.id} created`,
        at: sale.created_at,
        by: user.username
      })),
      ...purchases.map(purchase => ({
        type: 'Purchase',
        description: `Purchase #${purchase.id} created`,
        at: purchase.created_at,
        by: user.username
      })),
      ...payments.map(payment => ({
        type: 'Payment',
        description: `Payment #${payment.id} of ${payment.amount} created`,
        at: payment.created_at,
        by: user.username
      }))
    ].sort((a, b) => new Date(b.at) - new Date(a.at));

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};