const { findUserById, updateUserDB } = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userId != userId) {
        if(currentUser.userRole != "Admin") {
            return res.status(403).json({ message: 'Tài khoản này có quyền truy cập.' });
        }
    }
    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
        }
        const info = {
            userId: user.userId,
            userEmail: user.userEmail,
            userFullName: user.userFullName,
            userGender: user.userGender,
            userPhoneNumber: user.userPhoneNumber,
            userAddress: user.userAddress,
        };
        if (currentUser.userRole === 'Admin') {
            info.googleId = user.googleId;
            info.userRole = user.userRole;
            info.userStatus = user.userStatus;
            info.userCreatedAt = user.userCreatedAt;
            info.userUpdatedAt = user.userUpdatedAt;
        }
        res.status(200).json({ user: info });
    } catch (err) {
        res.status(500).json({ message: 'Tìm tài khoản thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    const currentUser = req.session.user;
    if (!req.session.user) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userId != userId) {
        if(currentUser.userRole != "Admin") {
            return res.status(403).json({ message: 'Tài khoản này có quyền truy cập.' });
        }
    }
    try {
        const newUser = {};
        let count = 0;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
        }
        if (userData.userFullName && user.userFullName !== userData.userFullName) {
            newUser.userFullName = userData.userFullName;
            count++;
        } else {
            newUser.userFullName = user.userFullName;
        }
        if (userData.userEmail && user.userEmail !== userData.userEmail) {
            newUser.userEmail = userData.userEmail;
            count++;
        } else {
            newUser.userEmail = user.userEmail;
        }
        if (userData.userPassword && !bcrypt.compareSync(userData.userPassword, user.userPassword)) {
            newUser.userPassword = bcrypt.hashSync(userData.userPassword, 10);
        }else {
            newUser.userPassword = user.userPassword;
        }
        if (userData.userGender && user.userGender !== userData.userGender) {
            newUser.userGender = userData.userGender;
            count++;
        } else {
            newUser.userGender = user.userGender;
        }
        if (userData.userPhoneNumber && user.userPhoneNumber !== userData.userPhoneNumber) {
            newUser.userPhoneNumber = userData.userPhoneNumber;
            count++;
        } else {
            newUser.userPhoneNumber = user.userPhoneNumber;
        }
        if (userData.userAddress && user.userAddress !== userData.userAddress) {
            newUser.userAddress = userData.userAddress;
            count++;
        } else {
            newUser.userAddress = user.userAddress;
        }
        if (userData.userRole && user.userRole !== userData.userRole) {
            newUser.userRole = userData.userRole;
            count++;
        } else {
            newUser.userRole = user.userRole;
        }
        if (userData.userStatus && user.userStatus !== userData.userStatus) {
            newUser.userStatus = userData.userStatus;
            count++;
        } else {
            newUser.userStatus = user.userStatus;
        }
        if (count == 0) {
            return res.status(400).json({ message: 'Không có thay đổi để cập nhật.' });
        }
        await updateUserDB(userId, newUser);
        if (newUser.userEmail) req.session.user.userEmail = newUser.userEmail;
        if (newUser.userFullName) req.session.user.userFullName = newUser.userFullName;
        if (newUser.userRole) req.session.user.userRole = newUser.userRole;
        if (newUser.userStatus) req.session.user.userStatus = newUser.userStatus;
        res.status(200).json({ message: 'Cập nhật thành công.', user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: 'Cập nhật thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

module.exports = {
    getUser,
    updateUser
};
