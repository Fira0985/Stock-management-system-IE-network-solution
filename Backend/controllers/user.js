const { isValidEmail } = require('../utils/validator')
const { SALT_ROUNDS } = require('../config')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { archived: false },
      include: {
        usersCreated: true,
        usersDeleted: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params; // Expecting email from the route parameter
  try {
    const user = await prisma.user.findUnique({
      where: { email }, // Prisma will match this email exactly
      include: {
        usersCreated: true,
        usersDeleted: true,
      },
    });

    if (!user || user.archived) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user by email', details: error.message });
  }
};


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
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

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

// Delete User (Hard Delete by Email)
const deleteUser = async (req, res) => {
  const { email, deleted_by_id } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required to identify the user' });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hard delete user
    await prisma.user.delete({
      where: { email },
    });

    res.json({ message: 'User permanently deleted', deleted_by_id, deleted_email: email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addUser, editUser, deleteUser, getAllUsers, getUserByEmail };