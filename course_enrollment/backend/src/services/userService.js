const { findUserById, updateUserById } = require("../models/userModel");

const getUserById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("Không tìm thấy user.");
  if (user.userPassword) delete user.userPassword;
  return user;
};

const updateUserByIdService = async (userId, data) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("Không tìm thấy user.");
  const allowedFields = ["userFullName", "userPhoneNumber"];
  const filteredData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) filteredData[key] = data[key];
  }
  if (Object.keys(filteredData).length === 0) return await getUserById(userId);
  const result = await updateUserById(userId, filteredData);
  if (!result) throw new Error("Lỗi khi cập nhật user.");
  if (result.affectedRows === 0)
    throw new Error("Không có thay đổi nào được cập nhật.");
  return await getUserById(userId);
};

module.exports = {
  getUserById,
  updateUserById: updateUserByIdService,
};
