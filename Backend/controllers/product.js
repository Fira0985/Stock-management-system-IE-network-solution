const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { archived: false },
      include: {
        category: true,
        created_by: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        created_by: true,
      },
    });
    if (!product || product.archived) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};


const addProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      sale_price,
      cost_price,
      category_id,
      created_by_id
    } = req.body;

    // If an image file was uploaded, build its URL
    let image_url = null;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Ensure required fields
    if (!name || !category_id || !created_by_id) {
      return res.status(400).json({ error: 'Missing required fields: name, category_id, created_by_id' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        barcode: barcode || null,
        image_url,
        sale_price: sale_price ? parseFloat(sale_price) : null,
        cost_price: cost_price ? parseFloat(cost_price) : null,
        category_id: parseInt(category_id),
        created_by_id: parseInt(created_by_id)
      }
    });

    res.status(201).json({ message: 'Successfully created the product', product });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
};


// Edit Product
const editProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const data = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    res.json({ message: "Update successful", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit product', details: error.message });
  }
};

module.exports = { addProduct, editProduct, getAllProducts, getProductById }