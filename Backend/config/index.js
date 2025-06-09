require('dotenv').config(); // if you're using .env files

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  SALT_ROUNDS: 10,
};
