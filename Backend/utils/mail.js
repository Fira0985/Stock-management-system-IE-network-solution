const nodemailer = require('nodemailer');
require('dotenv').config(); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'firafisberhanu4@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

const sendCodeEmail = async (to, code) => {
  if (!process.env.MAIL_PASS) {
    throw new Error('Email service is not configured');
  }

  await transporter.sendMail({
    from: '"StockM." <firafisberhanu4@gmail.com>',
    to,
    subject: 'Your Password Reset Code',
    text: `verfication code is: ${code}`
  });
};

module.exports = sendCodeEmail;
