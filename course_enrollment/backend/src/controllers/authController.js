const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    if (user) {
      delete user.userPassword;
      delete user.googleId;
      delete user.userOtp;
      delete user.userOtpExpire;
    }
    res.status(201).json({ message: "Đăng ký thành công.", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    const { token, user } = await loginUser(userEmail, userPassword);
    if (user) {
      delete user.userPassword;
      delete user.googleId;
      delete user.userOtp;
      delete user.userOtpExpire;
    }
    res.status(200).json({ message: "Đăng nhập thành công.", token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const baseUrl = req.headers.origin || `http://${req.headers.host}`;
    await requestPasswordReset(userEmail, baseUrl);
    res.status(200).json({ message: "Đã gửi email đặt lại mật khẩu." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const doResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.status(200).json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, forgotPassword, doResetPassword };
