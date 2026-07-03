const { isValidEmail } = require('../utils/validator')
const { JWT_SECRET } = require('../config')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Token Generation Helpers
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', expired: true });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
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

    if (!user.verfied) {
      return res.status(400).json({ error: 'Email not verified' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });

      const newAccessToken = generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });

      res.json({ token: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: 'Refresh failed' });
  }
};

module.exports = {
  authenticateToken,
  loginUser,
  refreshToken
};
