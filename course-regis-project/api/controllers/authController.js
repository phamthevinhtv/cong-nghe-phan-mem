const { findUserByEmail, createUser } = require('../models/userModel');
const sendEmail = require('../utils/sendMail');

const register = async (req, res) => {
    const userData = req.body;
    const registerSuccess = 'Đăng ký tài khoản thành công.';
    try {
        const existingUser = await findUserByEmail(userData.userEmail);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }
        await createUser(userData);
        const subject = registerSuccess;
        const text = `Xin chào ${userData.userFullName},\n\nBạn đã đăng ký tài khoản thành công với email: ${userData.userEmail}.\n\nTrân trọng!`;
        await sendEmail(userData.userEmail, subject, text);
        res.status(201).json({ message: registerSuccess });
    } catch (err) {
        res.status(500).json({ message: `Đăng ký tài khoản thất bại: ${err.message}` });
    }
};

module.exports = {
    register
}