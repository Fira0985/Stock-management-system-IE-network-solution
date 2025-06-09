const isValidEmail = require('../utils/validator')
const {JWT_SECRET} = require('../config')
const bcrypt = require('bcrypt')
const prisma = require('@prisma/client')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
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

module.exports = {authenticateToken,
    loginUser};