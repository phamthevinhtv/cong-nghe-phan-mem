const { findUserByEmail, createUser } = require('../models/userModel');
const { updateOtp, updatePassword } = require('../models/authModel');
const sendEmail = require('../utils/sendMail');
const nanoid = require('nanoid').nanoid;
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

const requestResetPassword = async (req, res) => {
    const { userEmail } = req.body;
    try {
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }
        const userOtp = nanoid(6);
        const expire = new Date(Date.now() + 10 * 60 * 1000);
        await updateOtp(user.userId, userOtp, expire);
        const subject = 'Mã OTP xác thực đặt lại mật khẩu';
        const text = `Xin chào ${user.userFullName},\n\nMã OTP của bạn là: ${userOtp}. Mã này có hiệu lực trong 10 phút.\n\nTrân trọng!`;
        await sendEmail(userEmail, subject, text);
        res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn.' });
    } catch (err) {
        res.status(500).json({ message: 'Yêu cầu đặt lại mật khẩu thất bại.' });
        console.log(`Lỗi: ${err.message}`);
    }
};

const resetPassword = async (req, res) => {
    const { userEmail, userOtp, userPassword } = req.body;
    try {
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }
        if (user.userOtp !== userOtp || new Date() > new Date(user.userOtpExpire)) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
        }
        await updatePassword(user.userId, userPassword);
        const subject = 'Đổi mật khẩu thành công';
        const text = `Xin chào ${user.userFullName},\n\nMật khẩu của bạn đã được đổi thành công vào lúc ${new Date().toLocaleString()}.\n\nTrân trọng!`;
        await sendEmail(userEmail, subject, text);
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Đổi mật khẩu thất bại.' });
        console.log(`Lỗi: ${err.message}`);
    }
};

module.exports = {
    register,
    login,
    requestResetPassword,
    resetPassword
}
