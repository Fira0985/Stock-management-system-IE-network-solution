const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function for week number (ISO)
function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

async function getSalesSummary(req, res) {
    try {
        const sales = await prisma.sale.findMany({
            where: { archived: false, deleted_at: null },
            include: {
                items: {
                    include: { product: { include: { category: true } } },
                    where: { archived: false },
                },
                customer: true,
                created_by: true,
            },
        });

        const totalSalesAmount = sales.reduce((acc, s) => acc + s.total, 0);
        const numberOfSales = sales.length;
        const avgSalePerTransaction = numberOfSales > 0 ? totalSalesAmount / numberOfSales : 0;

        const productSalesMap = new Map();
        for (const sale of sales) {
            for (const item of sale.items) {
                const pid = item.product_id;
                if (!productSalesMap.has(pid)) {
                    productSalesMap.set(pid, {
                        productId: pid,
                        productName: item.product.name,
                        quantitySold: 0,
                        revenue: 0,
                    });
                }
                const prod = productSalesMap.get(pid);
                prod.quantitySold += item.quantity;
                prod.revenue += item.quantity * item.unit_price;
            }
        }

        const topSellingProductsByQuantity = [...productSalesMap.values()]
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);

        const topSellingProductsByRevenue = [...productSalesMap.values()]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const categorySalesMap = new Map();
        for (const sale of sales) {
            for (const item of sale.items) {
                const cat = item.product.category;
                if (!categorySalesMap.has(cat.id)) {
                    categorySalesMap.set(cat.id, { categoryId: cat.id, categoryName: cat.name, totalSales: 0 });
                }
                categorySalesMap.get(cat.id).totalSales += item.quantity * item.unit_price;
            }
        }
        const salesByCategory = [...categorySalesMap.values()];

        const creditSales = sales.filter(s => s.type === "CREDIT");
        const outstandingBalanceDue = creditSales.reduce((acc, s) => acc + s.balance_due, 0);
        const customersWithPendingDues = creditSales
            .filter(s => s.balance_due > 0 && s.customer)
            .map(s => ({
                customerId: s.customer.id,
                customerName: s.customer.name,
                balanceDue: s.balance_due,
                dueDate: s.due_date,
            }));

        const salesByUserMap = new Map();
        for (const sale of sales) {
            const user = sale.created_by;
            if (!salesByUserMap.has(user.id)) {
                salesByUserMap.set(user.id, { userId: user.id, username: user.username, salesCount: 0, salesTotal: 0 });
            }
            const userData = salesByUserMap.get(user.id);
            userData.salesCount += 1;
            userData.salesTotal += sale.total;
        }
        const salesPerformanceByUser = [...salesByUserMap.values()];

        return res.json({
            totalSalesAmount,
            numberOfSales,
            avgSalePerTransaction,
            topSellingProductsByQuantity,
            topSellingProductsByRevenue,
            salesByCategory,
            outstandingBalanceDue,
            customersWithPendingDues,
            salesPerformanceByUser,
        });
    } catch (error) {
        console.error("Error in getSalesSummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getInventorySummary(req, res) {
    try {
        // Fetch all purchase items with product and purchase included
        const rawPurchaseItems = await prisma.purchaseItem.findMany({
            where: { archived: false },
            include: {
                product: true,
                purchase: true, // Remove 'where' here — not allowed inside include
            },
        });

        // Manually filter out purchaseItems with deleted/archived purchase
        const purchaseItems = rawPurchaseItems.filter(
            pi => pi.purchase && !pi.purchase.archived && pi.purchase.deleted_at === null
        );

        // Map of purchased quantities per product
        const purchaseQuantityMap = new Map();
        purchaseItems.forEach(pi => {
            const pid = pi.product_id;
            if (!purchaseQuantityMap.has(pid)) purchaseQuantityMap.set(pid, 0);
            purchaseQuantityMap.set(pid, purchaseQuantityMap.get(pid) + pi.quantity);
        });

        // Fetch all sales with items and products
        const sales = await prisma.sale.findMany({
            where: { archived: false, deleted_at: null },
            include: {
                items: {
                    where: { archived: false },
                    include: { product: true },
                },
            },
        });

        // Map of sold quantities per product
        const soldQuantityMap = new Map();
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const pid = item.product_id;
                if (!soldQuantityMap.has(pid)) soldQuantityMap.set(pid, 0);
                soldQuantityMap.set(pid, soldQuantityMap.get(pid) + item.quantity);
            });
        });

        // Fetch all products for stock movement and dead stock
        const products = await prisma.product.findMany({
            where: { archived: false, deleted_at: null },
            include: { category: true },
        });

        const lowStockThreshold = 10;

        // Build stock movement report
        const stockMovementReport = products.map(p => {
            const purchasedQty = purchaseQuantityMap.get(p.id) || 0;
            const soldQty = soldQuantityMap.get(p.id) || 0;
            const currentStock = purchasedQty - soldQty;
            return {
                productId: p.id,
                productName: p.name,
                purchasedQuantity: purchasedQty,
                soldQuantity: soldQty,
                currentStock,
                lowStockAlert: currentStock < lowStockThreshold,
            };
        });

        // Calculate inventory value
        let totalCostValue = 0;
        let totalSaleValue = 0;
        stockMovementReport.forEach(item => {
            const p = products.find(pr => pr.id === item.productId);
            if (p) {
                totalCostValue += p.cost_price * item.currentStock;
                totalSaleValue += p.sale_price * item.currentStock;
            }
        });

        // Profit margin per product
        const profitMarginByProduct = products.map(p => ({
            productId: p.id,
            productName: p.name,
            profitMargin: p.sale_price - p.cost_price,
        }));

        // Dead stock = not sold in the last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const soldProductIdsLast90Days = new Set();
        sales.forEach(sale => {
            if (sale.created_at >= ninetyDaysAgo) {
                sale.items.forEach(item => soldProductIdsLast90Days.add(item.product_id));
            }
        });

        const deadStockReport = products
            .filter(p => !soldProductIdsLast90Days.has(p.id))
            .map(p => ({ productId: p.id, productName: p.name }));


        // Final response
        return res.json({
            stockMovementReport,
            totalCostValue,
            totalSaleValue,
            profitMarginByProduct,
            deadStockReport,
        });
    } catch (error) {
        console.error("Error in getInventorySummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPurchaseSummary(req, res) {
    try {
        const purchases = await prisma.purchase.findMany({
            where: { archived: false, deleted_at: null },
            include: {
                supplier: true,
                items: {
                    include: { product: true },
                },
            },
        });

        const purchasesBySupplierMap = new Map();
        for (const purchase of purchases) {
            const sup = purchase.supplier;
            if (!purchasesBySupplierMap.has(sup.id)) {
                purchasesBySupplierMap.set(sup.id, { supplierId: sup.id, supplierName: sup.name, totalPurchase: 0 });
            }
            const supData = purchasesBySupplierMap.get(sup.id);
            supData.totalPurchase += purchase.items.reduce((a, i) => a + i.cost_price * i.quantity, 0);
        }
        const totalPurchasesBySupplier = [...purchasesBySupplierMap.values()];

        const monthlyPurchaseTrendMap = new Map();
        for (const purchase of purchases) {
            const monthKey = purchase.created_at.toISOString().slice(0, 7); // YYYY-MM
            if (!monthlyPurchaseTrendMap.has(monthKey)) monthlyPurchaseTrendMap.set(monthKey, 0);
            monthlyPurchaseTrendMap.set(monthKey, monthlyPurchaseTrendMap.get(monthKey) + purchase.items.reduce((a, i) => a + i.cost_price * i.quantity, 0));
        }
        const monthlyPurchaseTrend = [...monthlyPurchaseTrendMap.entries()].map(([month, amount]) => ({ month, amount }));

        return res.json({
            totalPurchasesBySupplier,
            monthlyPurchaseTrend,
        });
    } catch (error) {
        console.error("Error in getPurchaseSummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPaymentSummary(req, res) {
    try {
        const payments = await prisma.payment.findMany({
            where: { deleted_at: null },
            include: { sale: true, created_by: true },
        });

        const paymentsByDay = new Map();
        payments.forEach(payment => {
            const day = payment.paid_at.toISOString().slice(0, 10);
            paymentsByDay.set(day, (paymentsByDay.get(day) || 0) + payment.amount);
        });

        const paymentsByWeek = new Map();
        payments.forEach(payment => {
            const d = payment.paid_at;
            const year = d.getFullYear();
            const week = getWeekNumber(d);
            const key = `${year}-W${week}`;
            paymentsByWeek.set(key, (paymentsByWeek.get(key) || 0) + payment.amount);
        });

        const paymentsByMonth = new Map();
        payments.forEach(payment => {
            const month = payment.paid_at.toISOString().slice(0, 7);
            paymentsByMonth.set(month, (paymentsByMonth.get(month) || 0) + payment.amount);
        });

        // Customer Credit Report
        const customers = await prisma.nonUser.findMany({
            where: { type: "CUSTOMER", archived: false },
            include: {
                sales: {
                    where: { type: "CREDIT", balance_due: { gt: 0 }, archived: false },
                    include: { payments: true },
                },
            },
        });

        const customerCreditReport = customers.map(cust => {
            const creditUsed = cust.sales.reduce((acc, s) => acc + s.total - s.paid_amount, 0);
            const balanceDue = cust.sales.reduce((acc, s) => acc + s.balance_due, 0);
            return {
                customerId: cust.id,
                customerName: cust.name,
                creditLimit: cust.credit_limit,
                creditUsed,
                balanceDue,
                dueDates: cust.sales.filter(s => s.balance_due > 0).map(s => s.due_date),
            };
        });

        const paymentsBySaleId = new Map();
        payments.forEach(p => {
            if (!paymentsBySaleId.has(p.sale_id)) paymentsBySaleId.set(p.sale_id, []);
            paymentsBySaleId.get(p.sale_id).push({
                paymentId: p.id,
                amount: p.amount,
                paidAt: p.paid_at,
                createdById: p.created_by_id,
            });
        })

        return res.json({
            paymentsByDay: Object.fromEntries(paymentsByDay),
            paymentsByWeek: Object.fromEntries(paymentsByWeek),
            paymentsByMonth: Object.fromEntries(paymentsByMonth),
            customerCreditReport,
            paymentsBySaleId: Object.fromEntries(paymentsBySaleId),
        });
    } catch (error) {
        console.error("Error in getPaymentSummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getUserActivitySummary(req, res) {
    try {
        const usersCreatedDeleted = await prisma.user.findMany({
            where: {
                OR: [
                    { deleted_at: null },
                    { deleted_at: { not: null } },
                ],
            },
            select: {
                id: true,
                username: true,
                created_at: true,
                deleted_at: true,
                created_by: true,
                deleted_by: true,
            },
        });

        const productsAddedRemoved = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                created_at: true,
                deleted_at: true,
            },
        });
        const categoriesAddedRemoved = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                created_at: true,
                deleted_at: true,
            },
        });

        const salesDeleted = await prisma.sale.findMany({
            where: { deleted_at: { not: null } },
            select: { id: true, created_at: true, deleted_at: true },
        });
        const purchasesDeleted = await prisma.purchase.findMany({
            where: { deleted_at: { not: null } },
            select: { id: true, created_at: true, deleted_at: true },
        });

        const roleDistribution = await prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });


        return res.json({
            usersCreatedDeleted,
            productsAddedRemoved,
            categoriesAddedRemoved,
            salesDeleted,
            purchasesDeleted,
            roleDistribution,
        });
    } catch (error) {
        console.error("Error in getUserActivitySummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getBusinessHealthSummary(req, res) {
    try {
        const sales = await prisma.sale.findMany({
            where: { archived: false, deleted_at: null },
            include: {
                items: {
                    include: { product: true },
                    where: { archived: false },
                },
            },
        });

        const salesWithItems = sales.map(sale => {
            let costTotal = 0;
            sale.items.forEach(item => {
                costTotal += item.quantity * item.product.cost_price;
            });
            return {
                saleDate: sale.created_at,
                total: sale.total,
                costTotal,
            };
        });

        const grossProfitByDayMap = new Map();
        salesWithItems.forEach(s => {
            const day = s.saleDate.toISOString().slice(0, 10);
            const profit = s.total - s.costTotal;
            grossProfitByDayMap.set(day, (grossProfitByDayMap.get(day) || 0) + profit);
        });

        const grossProfitByMonthMap = new Map();
        salesWithItems.forEach(s => {
            const month = s.saleDate.toISOString().slice(0, 7);
            const profit = s.total - s.costTotal;
            grossProfitByMonthMap.set(month, (grossProfitByMonthMap.get(month) || 0) + profit);
        });

        const grossProfitByWeekMap = new Map();
        salesWithItems.forEach(s => {
            const date = s.saleDate;
            const year = date.getFullYear();
            const week = getWeekNumber(date);
            const key = `${year}-W${week}`;
            const profit = s.total - s.costTotal;
            grossProfitByWeekMap.set(key, (grossProfitByWeekMap.get(key) || 0) + profit);
        });

        const avgMonthlyProfit = [...grossProfitByMonthMap.values()].reduce((a, b) => a + b, 0) / Math.max(grossProfitByMonthMap.size, 1);
        const revenueForecastNextMonth = avgMonthlyProfit;

        // Customer Purchase Frequency
        const purchaseCountByCustomer = new Map();
        for (const sale of sales) {
            if (sale.customer_id) {
                purchaseCountByCustomer.set(sale.customer_id, (purchaseCountByCustomer.get(sale.customer_id) || 0) + 1);
            }
        }

        const customerPurchaseFrequency = [];
        for (const [cid, count] of purchaseCountByCustomer.entries()) {
            const customer = await prisma.nonUser.findUnique({ where: { id: cid } });
            if (customer) {
                customerPurchaseFrequency.push({
                    customerId: cid,
                    customerName: customer.name,
                    purchaseCount: count,
                });
            }
        }

        const products = await prisma.product.findMany({
            where: { archived: false, deleted_at: null },
        });

        const suppliers = await prisma.nonUser.findMany({
            where: { type: "SUPPLIER", archived: false },
        });

        // Supplier Dependence Analysis: % of inventory depends on each supplier
        const supplierDependence = [];
        for (const supplier of suppliers) {
            const purchasesFromSupplier = await prisma.purchaseItem.findMany({
                where: {
                    purchase: {
                        supplier_id: supplier.id,
                        archived: false,
                        deleted_at: null,
                    },
                    archived: false,
                },
                include: { product: true },
            });

            let totalQuantity = 0;
            purchasesFromSupplier.forEach(pi => {
                totalQuantity += pi.quantity;
            });

            supplierDependence.push({
                supplierId: supplier.id,
                supplierName: supplier.name,
                percentage: totalQuantity, // We'll calculate percentage below after total sum
            });
        }

        // Calculate total quantity from all suppliers for percentage
        const totalSupplierQuantity = supplierDependence.reduce((a, b) => a + b.percentage, 0);
        supplierDependence.forEach(s => {
            s.percentage = totalSupplierQuantity > 0 ? ((s.percentage / totalSupplierQuantity) * 100).toFixed(2) + '%' : '0%';
        });

        return res.json({
            grossProfitByDay: Object.fromEntries(grossProfitByDayMap),
            grossProfitByWeek: Object.fromEntries(grossProfitByWeekMap),
            grossProfitByMonth: Object.fromEntries(grossProfitByMonthMap),
            revenueForecastNextMonth,
            customerPurchaseFrequency,
            supplierDependence,
        });
    } catch (error) {
        console.error("Error in getBusinessHealthSummary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getSalesSummary,
    getInventorySummary,
    getPurchaseSummary,
    getPaymentSummary,
    getUserActivitySummary,
    getBusinessHealthSummary,
};
