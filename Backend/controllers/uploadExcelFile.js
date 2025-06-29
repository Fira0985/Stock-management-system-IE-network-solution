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

        for (const row of sheetData) {
            // Validate required fields
            if (!row.category_name || !row.product_name || !row.sale_price || !row.cost_price || !row.created_by_id) {
                continue; // skip invalid rows
            }

            // Try to find category by name
            let category = await prisma.category.findFirst({
                where: {
                    name: row.category_name,
                },
            });

            // If category doesn't exist, create it
            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: row.category_name,
                        created_by_id: parseInt(row.created_by_id),
                    },
                });
            }

            const result = await prisma.product.findUnique({
                where: {
                    name: row.product_name,
                    archived: false
                },
            });

            if (result) {
               return res.status(500).json({ message: 'The Product already exist' })
            }


            // Insert product
            await prisma.product.create({
                data: {
                    name: row.product_name,
                    barcode: row.barcode ? String(row.barcode) : null,
                    unit: row.unit || null,
                    image_url: row.image_url || null,
                    sale_price: parseFloat(row.sale_price),
                    cost_price: parseFloat(row.cost_price),
                    category_id: category.id,
                    created_by_id: parseInt(row.created_by_id),
                },
            });
        }

        fs.unlinkSync(filePath); // remove file after processing
        res.status(200).json({ message: 'Excel data imported successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to process Excel file' });
    }
};

module.exports = {
    uploadExcelFile,
};
