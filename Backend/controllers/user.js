const isValidEmail = require('../utils/validator')
const {SALT_ROUNDS} = require('../config')
const bcrypt = require('bcrypt')
const prisma = require('@prisma/client')
// Add User
const addUser = async (req, res) => {
  try {
    const {
      username,
      email,
      role,
      password,
      phone,
      created_by_id
    } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        role,
        password_hash,
        phone,
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

module.exports ={addUser, editUser, deleteUser}