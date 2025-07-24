const connection = require("../config/database");

const createUser = async (user) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (userId, googleId, userFullName, userEmail, userPhoneNumber, userPassword, userRole, userOtp, userOtpExpire) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sql,
      [
        user.userId,
        user.googleId || null,
        user.userFullName,
        user.userEmail,
        user.userPhoneNumber || null,
        user.userPassword,
        user.userRole,
        user.userOtp || null,
        user.userOtpExpire || null,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const findUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE userEmail = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const setResetToken = async (userEmail, token, expire) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET userOtp = ?, userOtpExpire = ? WHERE userEmail = ?",
      [token, expire, userEmail],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const findUserByResetToken = async (token) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE userOtp = ?",
      [token],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const updatePasswordByUserId = async (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET userPassword = ?, userOtp = NULL, userOtpExpire = NULL WHERE userId = ?",
      [newPassword, userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  setResetToken,
  findUserByResetToken,
  updatePasswordByUserId,
};
