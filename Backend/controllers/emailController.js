// controllers/emailController.js
const transporter = require('../utils/transpoter');

/**
 * POST /api/email/message
 * Body: { "name": "John Doe", "message": "Hi there …" }
 *
 * Sends an email **from** and **to** firafisberhanu4@gmail.com
 * with the user‑supplied name & message.
 */
exports.sendSelfMessage = async (req, res) => {
    const { name, message } = req.body;

    // Basic validation
    if (!name || !message) {
        return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    // Compose the email
    const mailOptions = {
        from: '"StockM. Contact" <firafisberhanu4@gmail.com>',
        to: 'firafisberhanu4@gmail.com',              // me ➜ me
        subject: `New message from ${name}`,
        text: `You received a new message:\n\nFrom: ${name}\n\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (err) {
        console.error('Email send failed:', err);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};
