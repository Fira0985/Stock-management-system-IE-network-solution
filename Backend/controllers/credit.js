const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllCredits = async (req, res) => {
    try {
        const credits = await prisma.sale.findMany({
            where: {
                type: "CREDIT",
                archived: false,
            },
            include: {
                customer: true,
                items: true,
                payments: true,
            },
        });
        res.json(credits);
    } catch (error) {
        console.error("getAllCredits error:", error);
        res.status(500).json({ error: "Failed to fetch credit sales." });
    }
};

exports.getPaidCredits = async (req, res) => {
    try {
        const credits = await prisma.sale.findMany({
            where: {
                type: "CREDIT",
                payment_status: "PAID",
                archived: false,
            },
            include: {
                customer: true,
                payments: true,
            },
        });
        res.json(credits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch paid credit sales." });
    }
};

exports.getUnpaidCredits = async (req, res) => {
    try {
        const credits = await prisma.sale.findMany({
            where: {
                type: "CREDIT",
                payment_status: "UNPAID",
                archived: false,
            },
            include: {
                customer: true,
                payments: true,
            },
        });
        res.json(credits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch unpaid credit sales." });
    }
};

exports.getPartialCredits = async (req, res) => {
    try {
        const credits = await prisma.sale.findMany({
            where: {
                type: "CREDIT",
                payment_status: "PARTIAL",
                archived: false,
            },
            include: {
                customer: true,
                payments: true,
            },
        });
        res.json(credits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch partial credit sales." });
    }
};
exports.makePayment = async (req, res) => {
    const { sale_id, amount } = req.body;
    const userId = req.user?.id;

    try {
        const parsedSaleId = parseInt(sale_id);
        const parsedAmount = parseFloat(amount);

        if (!parsedSaleId || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid sale ID or amount.' });
        }

        const sale = await prisma.sale.findUnique({
            where: { id: parsedSaleId },
            include: { customer: true }
        });

        if (!sale) return res.status(404).json({ error: 'Sale not found.' });
        if (sale.archived) return res.status(400).json({ error: 'Sale is archived.' });
        if (sale.type !== 'CREDIT') return res.status(400).json({ error: 'Only credit sales can be paid.' });

        const newPaid = sale.paid_amount + parsedAmount;
        const newBalance = sale.total - newPaid;

        const newStatus =
            newPaid >= sale.total ? 'PAID' :
                newPaid > 0 ? 'PARTIAL' :
                    'UNPAID';

        const updatedSale = await prisma.$transaction(async (tx) => {
            // 1. Create payment record
            await tx.payment.create({
                data: {
                    amount: parsedAmount,
                    sale_id: parsedSaleId,
                    created_by_id: userId,
                }
            });

            // 2. Update sale record
            const updated = await tx.sale.update({
                where: { id: parsedSaleId },
                data: {
                    paid_amount: newPaid,
                    balance_due: newBalance,
                    payment_status: newStatus
                }
            });

            // 3. Restore credit limit to the customer
            if (sale.customer_id) {
                await tx.nonUser.update({
                    where: { id: sale.customer_id },
                    data: {
                        credit_limit: {
                            increment: parsedAmount
                        }
                    }
                });
            }

            return updated;
        });

        res.status(200).json({ message: 'Payment successful.', sale: updatedSale });

    } catch (error) {
        console.error('makePayment error:', error);
        res.status(500).json({ error: 'Payment failed.', details: error.message });
    }
};
