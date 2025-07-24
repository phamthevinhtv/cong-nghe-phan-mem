const { getUserById, updateUserById } = require("../services/userService");

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    if (!currentUser)
      return res
        .status(401)
        .json({ message: "Thiếu hoặc sai token xác thực." });
    if (currentUser.userRole === "Admin") {
      const user = await getUserById(userId);
      return res.status(200).json({ user });
    }
    if (currentUser.userId !== userId) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const user = await getUserById(userId);
    if (user) {
      delete user.userPassword;
      delete user.googleId;
      delete user.userOtp;
      delete user.userOtpExpire;
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    if (!currentUser)
      return res
        .status(401)
        .json({ message: "Thiếu hoặc sai token xác thực." });
    if (currentUser.userRole !== "Admin" && currentUser.userId !== userId) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const allowedFields = ["userFullName", "userPhoneNumber"];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (!updateData.userFullName && !updateData.userPhoneNumber) {
      return res
        .status(400)
        .json({ message: "Không có thay đổi nào được cập nhật." });
    }
    const user = await getUserById(userId);
    if (
      (updateData.userFullName === undefined ||
        updateData.userFullName === user.userFullName) &&
      (updateData.userPhoneNumber === undefined ||
        updateData.userPhoneNumber === user.userPhoneNumber)
    ) {
      return res
        .status(400)
        .json({ message: "Không có thay đổi nào được cập nhật." });
    }
    const updatedUser = await updateUserById(userId, updateData);
    if (updatedUser) {
      delete updatedUser.userPassword;
      delete updatedUser.googleId;
      delete updatedUser.userOtp;
      delete updatedUser.userOtpExpire;
    }
    res
      .status(200)
      .json({ message: "Cập nhật thành công.", user: updatedUser });
  } catch (err) {
    const code = err.message === "Không tìm thấy user." ? 404 : 400;
    res.status(code).json({ message: err.message });
  }
};

module.exports = {
  getUser,
  updateUser,
};
