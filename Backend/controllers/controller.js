const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Email validation helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'Valid email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Add User
const addUser = async (req, res) => {
  try {
    const {
      username,
      email,
      role,
      password_hash,
      phone,
      address,
      credit_limit,
      created_by_id
    } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        role,
        password_hash,
        phone,
        address,
        credit_limit,
        created_by_id
      },
    });

    res.status(201).json({ message: "Successfully registered", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit User (by email)
const editUser = async (req, res) => {
  const { email, ...updateData } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required to identify the user' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    res.json({ message: 'Successfully updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User (Soft Delete by email)
const deleteUser = async (req, res) => {
  const { email, deleted_by_id } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required to identify the user' });
  }

  try {
    const deletedUser = await prisma.user.update({
      where: { email },
      data: {
        deleted_at: new Date(),
        deleted_by_id,
        archived: true
      },
    });

    res.json({ message: 'User soft-deleted', deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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

    res.status(201).json({ message: "Successfully created the product", product });
  } catch (error) {
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

    res.status(201).json({ message: "Successfully created the category", category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category', details: error.message });
  }
};

// Edit Category
const editCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const data = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    res.json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit category', details: error.message });
  }
};

module.exports = {
  addProduct,
  addCategory,
  addUser,
  editUser,
  deleteUser,
  editProduct,
  editCategory,
  loginUser
};
