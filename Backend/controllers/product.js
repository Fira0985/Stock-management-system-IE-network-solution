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
  const { id } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        created_by: true,
        purchaseItems: true,
        saleItems: true,
        
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
      unit,
      sale_price,
      cost_price,
      category_id,
      category,
      created_by_id,
      archived // optional
    } = req.body;

    const userId = Number(created_by_id || req.user?.id);
    const categoryId = Number(category_id || category);
    const salePriceValue = Number(sale_price);
    const costPriceValue = Number(cost_price);

    // Validate required fields
    if (!name?.trim() || Number.isNaN(categoryId) || Number.isNaN(salePriceValue) || Number.isNaN(costPriceValue) || !userId) {
      return res.status(400).json({
        error: 'Missing or invalid required fields: name, sale_price, cost_price, category_id, created_by_id'
      });
    }

    // Check if product already exists (by name and not archived)
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: name,
        archived: false,
      },
    });

    if (existingProduct) {
      return res.status(409).json({ message: 'The product already exists' });
    }

    // Handle optional image upload
    let image_url = null;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        image_url,
        sale_price: salePriceValue,
        cost_price: costPriceValue,
        category_id: categoryId,
        created_by_id: userId,
        archived: archived === 'true',
      },
    });

    res.status(201).json({
      message: 'Successfully created the product',
      product,
    });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      error: 'Failed to add product',
      details: error.message,
    });
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