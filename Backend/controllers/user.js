const { isValidEmail } = require('../utils/validator')
const { SALT_ROUNDS } = require('../config')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendEmail = require('../utils/mail')

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


const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image_url: imageUrl }
    });

    res.status(200).json({ message: 'Profile image uploaded', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { email, password, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return res.status(404).json({ message: 'Email not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (user.verfied) {
    return res.status(400).json({ error: 'User already registered' })
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiresAt = new Date(Date.now() + 10 * 60000); // Expires in 10 minutes

  await prisma.user.update({
    where: { email },
    data: {
      verfiy_code: code,
      verfiyCode_expireAt: expiresAt,
    },
  });

  await sendEmail(email, code);

  res.json({ message: 'Reset code sent to email' });
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user.verfiy_code !== code)
    return res.status(400).json({ message: 'Invalid code' });

  await prisma.user.update({
    where: { email },
    data: {
      verfied: true,
    },
  });

  if (new Date(user.verfiyCode_expireAt) < new Date())
    return res.status(400).json({ message: 'Code expired' });

  res.json({ message: 'Code verified' });
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password_hash: hashed,
      verfiy_code: null,
      verfiyCode_expireAt: null,
    },
  });

  res.json({ message: 'success' });
};

const getImage = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { image_url: true },
    });

    if (!user || !user.image_url) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ imageUrl: user.image_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image', details: error.message });
  }
}


module.exports = { addUser, editUser, deleteUser, getAllUsers, getUserByEmail, uploadProfileImage, verifyUser, verifyCode, changePassword, getImage };