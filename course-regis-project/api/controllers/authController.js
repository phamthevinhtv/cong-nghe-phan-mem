const { findUserByEmail, createUser } = require('../models/userModel');
const sendEmail = require('../utils/sendMail');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const userData = req.body;
    const registerSuccess = 'Đăng ký tài khoản thành công.';
    try {
        const user = await findUserByEmail(userData.userEmail);
        if (user) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }
        await createUser(userData);
        const subject = registerSuccess;
        const text = `Xin chào ${userData.userFullName},\n\nBạn đã đăng ký tài khoản thành công với email: ${userData.userEmail} vào lúc ${new Date().toLocaleString()}.\n\nTrân trọng!`;
        await sendEmail(userData.userEmail, subject, text);
        res.status(201).json({ message: registerSuccess });
    } catch (err) {
        res.status(500).json({ message: 'Đăng ký tài khoản thất bại.'});
        console.log(`Lỗi: ${err.message}`);
    }
};

const login = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Sai mật khẩu.' });
        }
        req.session.user = {
            userId: user.userId,
            userEmail: user.userEmail,
            userFullName: user.userFullName,
            userRole: user.userRole
        };
        res.status(200).json({ message: 'Đăng nhập thành công.', user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: `Đăng nhập thất bại.` });
        console.log(`Lỗi: ${err.message}`);
    }
};

module.exports = {
    register,
    login
}
