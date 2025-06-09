const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all NonUsers
const getAllNonUsers = async (req, res) => {
  try {
    const nonUsers = await prisma.nonUser.findMany({
      where: {
        archived: false, // Exclude archived by default
      },
      orderBy: {
        id: 'asc',
      },
    });

    res.json(nonUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch non-users', details: error.message });
  }
};

// Get a NonUser by ID
const getNonUserById = async (req, res) => {
  const { id } = req.body;

  try {
    const nonUser = await prisma.nonUser.findUnique({
      where: { id: parseInt(id) },
    });

    if (!nonUser || nonUser.archived) {
      return res.status(404).json({ error: 'NonUser not found' });
    }

    res.json(nonUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch non-user', details: error.message });
  }
};


// add NonUser
const addNonUser = async (req, res) => {
  try {
    const { name, address, phone, credit_limit, type } = req.body;

    if (!name || !type || !["CUSTOMER", "SUPPLIER"].includes(type.toUpperCase())) {
      return res.status(400).json({ error: "Name and valid type (CUSTOMER or SUPPLIER) are required." });
    }

    const nonUser = await prisma.nonUser.create({
      data: {
        name,
        address,
        phone,
        credit_limit,
        type: type.toUpperCase(),
      },
    });

    res.status(201).json({ message: "NonUser added successfully", nonUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit NonUser
const editNonUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, credit_limit, type } = req.body;

    const updated = await prisma.nonUser.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        phone,
        credit_limit,
        type: type?.toUpperCase(),
      },
    });

    res.status(200).json({ message: "NonUser updated successfully", nonUser: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete NonUser 
const deleteNonUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.nonUser.update({
      where: { id: parseInt(id) },
      data: {
        archived: true,
      },
    });

    res.status(200).json({ message: "NonUser archived (soft deleted)", nonUser: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {addNonUser, editNonUser, deleteNonUser, getAllNonUsers, getNonUserById}