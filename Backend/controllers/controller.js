const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      unit,
      image_url,
      sale_price,
      cost_price,
      category_id,
      archived,
      created_by_id,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        barcode,
        unit,
        image_url,
        sale_price,
        cost_price,
        category_id,
        archived,
        created_by_id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, parent_category_id, created_by_id } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        parent_category_id,
        created_by_id,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category', details: error.message });
  }
};

module.exports = {
  addProduct,
  addCategory,
};
