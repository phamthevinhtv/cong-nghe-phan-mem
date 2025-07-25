const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.log(`Lỗi gửi email: ${err.message}`);
  }
};

module.exports = sendMail;
