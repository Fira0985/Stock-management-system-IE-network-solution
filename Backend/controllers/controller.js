const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// add user
const addUser = async (req, res) => {
  try {
    const {
      username,
      role,
      password_hash,
      phone,
      address,
      credit_limit,
      created_by_id
    } = req.body;

    const newUser = await prisma.user.create({
      data: {
        username,
        role,
        password_hash,
        phone,
        address,
        credit_limit,
        created_by_id
      },
    });

    res.status(201).json({message: "successfully registered"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit User
const editUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const data = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({message: 'successfully Updated'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete User (Soft Delete)
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { deleted_by_id } = req.body;

  try {
    const deletedUser = await prisma.user.update({
      where: { id: userId },
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

    res.status(201).json({message: "successfully Created the Product"});
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

    res.status(201).json({message: "Successfully created the category"});
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category', details: error.message });
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

    res.json({message: "Update successfull"});
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit product', details: error.message });
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

    res.json(updatedCategory);
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
  editCategory
};
