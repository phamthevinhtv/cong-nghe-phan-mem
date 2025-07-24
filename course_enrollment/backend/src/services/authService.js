const bcrypt = require("bcrypt");
const {
  createUser,
  findUserByEmail,
  setResetToken,
  findUserByResetToken,
  updatePasswordByUserId,
} = require("../models/authModel");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.userEmail);
  if (existingUser) {
    throw new Error("Email đã được sử dụng.");
  }
  const hashedPassword = await bcrypt.hash(userData.userPassword, 10);
  const user = {
    userId: uuidv4(),
    googleId: userData.googleId || null,
    userFullName: userData.userFullName,
    userEmail: userData.userEmail,
    userPhoneNumber: userData.userPhoneNumber || null,
    userPassword: hashedPassword,
    userRole: userData.userRole || "Student",
    userOtp: null,
    userOtpExpire: null,
  };
  await createUser(user);
  return user;
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Email hoặc mật khẩu không đúng.");
  const match = await bcrypt.compare(password, user.userPassword);
  if (!match) throw new Error("Email hoặc mật khẩu không đúng.");

  const token = jwt.sign(
    { userId: user.userId, userEmail: user.userEmail, userRole: user.userRole },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  return { token, user };
};

const requestPasswordReset = async (userEmail, baseUrl) => {
  const user = await findUserByEmail(userEmail);
  if (!user) throw new Error("Email không tồn tại.");
  const token = uuidv4();
  const expire = new Date(Date.now() + 10 * 60 * 1000);
  await setResetToken(userEmail, token, expire);
  const link = `${baseUrl}/reset-password?token=${token}`;
  await sendMail(
    userEmail,
    "Đặt lại mật khẩu",
    `Nhấn vào link để đặt lại mật khẩu: ${link}\nLink có hiệu lực trong 10 phút.`
  );
};

const resetPassword = async (token, newPassword) => {
  const user = await findUserByResetToken(token);
  if (!user) throw new Error("Yêu cầu đặt lại mật khẩu không hợp lệ.");
  if (!user.userOtpExpire || new Date(user.userOtpExpire) < new Date())
    throw new Error("Yêu cầu đặt lại mật khẩu đã hết hiệu lực.");
  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePasswordByUserId(user.userId, hashed);
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
};
