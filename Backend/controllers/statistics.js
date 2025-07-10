// controllers/statistics.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { subHours } = require('date-fns');

// Helper: get start/end of today, this week, this month, this year
const getDateBounds = () => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    const startOfWeek = new Date(startOfToday);
    // Adjust so that Monday is day 1
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);

    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
    const startOfYear = new Date(startOfToday.getFullYear(), 0, 1);

    return { startOfToday, endOfToday, startOfWeek, startOfMonth, startOfYear };
};

exports.getSalesOverview = async (req, res, next) => {
    try {
        const { startOfToday, endOfToday, startOfWeek, startOfMonth } = getDateBounds();

        const totalAgg = await prisma.sale.aggregate({ _sum: { total: true } });
        const dailyAgg = await prisma.sale.aggregate({
            where: { created_at: { gte: startOfToday, lte: endOfToday } },
            _sum: { total: true }
        });
        const weeklyAgg = await prisma.sale.aggregate({
            where: { created_at: { gte: startOfWeek, lte: endOfToday } },
            _sum: { total: true }
        });
        const monthlyAgg = await prisma.sale.aggregate({
            where: { created_at: { gte: startOfMonth, lte: endOfToday } },
            _sum: { total: true }
        });

        res.json({
            totalSales: totalAgg._sum.total || 0,
            dailySales: dailyAgg._sum.total || 0,
            weeklySales: weeklyAgg._sum.total || 0,
            monthlySales: monthlyAgg._sum.total || 0,
        });
    } catch (err) {
        next(err);
    }
};

exports.getPurchaseOverview = async (req, res, next) => {
    try {
        const { startOfToday, endOfToday, startOfWeek, startOfMonth } = getDateBounds();

        // 1) Fetch all purchase-items with their parent purchase's created_at
        const items = await prisma.purchaseItem.findMany({
            select: {
                quantity: true,
                cost_price: true,
                purchase: { select: { created_at: true } }
            }
        });

        // 2) Aggregate in JS
        let total = 0;
        let daily = 0;
        let weekly = 0;
        let monthly = 0;

        items.forEach(item => {
            const value = item.quantity * item.cost_price;
            total += value;

            const ts = item.purchase.created_at;
            if (ts >= startOfToday && ts <= endOfToday) daily += value;
            if (ts >= startOfWeek && ts <= endOfToday) weekly += value;
            if (ts >= startOfMonth && ts <= endOfToday) monthly += value;
        });

        res.json({
            totalPurchases: total,
            dailyPurchases: daily,
            weeklyPurchases: weekly,
            monthlyPurchases: monthly,
        });
    } catch (err) {
        next(err);
    }
};

exports.getWeeklySalesChart = async (req, res, next) => {
    try {
        const { startOfWeek, endOfToday } = getDateBounds();
        // Group sales by day, summing total for each day
        const sales = await prisma.sale.findMany({
            where: { created_at: { gte: startOfWeek, lte: endOfToday } },
            select: { created_at: true, total: true }
        });

        // Aggregate by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayTotals = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            const day = dayNames[d.getDay()];
            dayTotals[day] = 0;
        }
        sales.forEach(sale => {
            const d = new Date(sale.created_at);
            const day = dayNames[d.getDay()];
            dayTotals[day] = (dayTotals[day] || 0) + Number(sale.total);
        });

        const result = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            const day = dayNames[d.getDay()];
            result.push({ day, sales: dayTotals[day] || 0 });
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMonthlyCategoryChart = async (req, res, next) => {
    try {
        const { startOfMonth, endOfToday } = getDateBounds();

        // Get all sales in the month, with items and product/category
        const sales = await prisma.sale.findMany({
            where: { created_at: { gte: startOfMonth, lte: endOfToday } },
            include: {
                items: {
                    include: { product: { include: { category: true } } }
                }
            }
        });

        // Aggregate by category
        const categoryTotals = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const cat = item.product.category;
                if (!cat) return;
                if (!categoryTotals[cat.name]) categoryTotals[cat.name] = 0;
                categoryTotals[cat.name] += Number(item.unit_price) * Number(item.quantity);
            });
        });

        const result = Object.entries(categoryTotals).map(([category, value]) => ({ category, value }));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getAnnualSalesChart = async (req, res, next) => {
    try {
        const { startOfYear, endOfToday } = getDateBounds();

        // Get all sales in the year
        const sales = await prisma.sale.findMany({
            where: { created_at: { gte: startOfYear, lte: endOfToday } },
            select: { created_at: true, total: true }
        });

        // Aggregate by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthTotals = {};
        for (let i = 0; i < 12; i++) {
            monthTotals[monthNames[i]] = 0;
        }
        sales.forEach(sale => {
            const m = monthNames[new Date(sale.created_at).getMonth()];
            monthTotals[m] = (monthTotals[m] || 0) + Number(sale.total);
        });

        const result = monthNames.map(m => ({ month: m, value: monthTotals[m] || 0 }));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getRecentActivity = async (req, res) => {
    try {
        const [recentSales, recentPurchases] = await Promise.all([
            prisma.sale.findMany({
                where: { deleted_at: null },
                orderBy: { created_at: 'desc' },
                take: 5,
                include: {
                    customer: true,
                }
            }),
            prisma.purchase.findMany({
                where: { deleted_at: null },
                orderBy: { created_at: 'desc' },
                take: 5,
                include: {
                    supplier: true,
                }
            })
        ]);

        const activities = [
            ...recentSales.map(sale => ({
                type: 'Sale',
                description: `New sale for $${sale.total.toFixed(2)}`,
                time: sale.created_at
            })),
            ...recentPurchases.map(purchase => ({
                type: 'Purchase',
                description: `New purchase from ${purchase.supplier?.name || 'Unknown'}`,
                time: purchase.created_at
            }))
        ];

        // Sort by most recent
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(activities.slice(0, 8));
    } catch (error) {
        console.error('Error in getRecentActivity:', error);
        res.status(500).json({ message: 'Failed to fetch activity' });
    }
};
