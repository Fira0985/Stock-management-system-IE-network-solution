const XLSX = require('xlsx');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const uploadExcelFile = async (req, res) => {
    try {
        const filePath = req.file.path;

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const skipped = []; // to track skipped rows

        for (const row of sheetData) {
            // Validate required fields
            if (!row.category_name || !row.product_name || !row.sale_price || !row.cost_price || !row.created_by_id) {
                skipped.push({ row, reason: 'Missing required fields' });
                continue;
            }

            // Find or create category
            let category = await prisma.category.findFirst({
                where: {
                    name: row.category_name,
                },
            });

            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: row.category_name,
                        created_by_id: parseInt(row.created_by_id),
                    },
                });
            }

            // Check if product exists
            const existingProduct = await prisma.product.findFirst({
                where: {
                    name: row.product_name,
                    archived: false,
                },
            });

            if (existingProduct) {
                skipped.push({ row, reason: 'Product already exists' });
                continue;
            }

            // Insert new product
            await prisma.product.create({
                data: {
                    name: row.product_name,
                    barcode: row.barcode ? String(row.barcode) : null,
                    image_url: row.image_url || null,
                    sale_price: parseFloat(row.sale_price),
                    cost_price: parseFloat(row.cost_price),
                    category_id: category.id,
                    created_by_id: parseInt(row.created_by_id),
                },
            });
        }

        fs.unlinkSync(filePath); // Clean up the uploaded file

        res.status(200).json({
            message: 'Excel data imported successfully!',
            skipped,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to process Excel file', error: error.message });
    }
};

module.exports = {
    uploadExcelFile,
};
