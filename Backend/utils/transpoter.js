const nodemailer = require('nodemailer');
require('dotenv').config(); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'firafisberhanu4@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

module.exports = transporter;
