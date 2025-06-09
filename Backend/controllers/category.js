const prisma = require('@prisma/client')

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

module.exports ={addCategory, editCategory}