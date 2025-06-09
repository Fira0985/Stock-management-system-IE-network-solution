const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { archived: false },
      include: {
        products: true,
        created_by: true,
        deleted_by: true,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
};

// Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        products: true,
        created_by: true,
        deleted_by: true,
      },
    });

    if (!category || category.archived) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category", details: error.message });
  }
};

// Delete Category 
const deleteCategory = async (req, res) => {
  try {
    const { id, deleted_by_id } = req.body;
    const categoryId = Number(id);

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    if (!category || category.archived) {
      return res.status(404).json({ message: "Category not found or already archived" });
    }

    // Prevent deletion if the category has products
    if (category.products.length > 0) {
      return res.status(400).json({ message: "Cannot delete category with associated products" });
    }

    // Soft-delete by updating archived and deleted_at
    const deletedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        archived: true,
        deleted_by_id: deleted_by_id, 
        deleted_at: new Date(),
        // Optionally: set deleted_by_id from authenticated user
        // deleted_by_id: req.user.id
      },
    });

    res.status(200).json({ message: "Category successfully deleted", category: deletedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
};



// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, created_by_id } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
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
    const { categoryId, ...updateData } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    res.json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit category', details: error.message });
  }
};

module.exports ={addCategory, editCategory, getAllCategories, getCategoryById, deleteCategory};