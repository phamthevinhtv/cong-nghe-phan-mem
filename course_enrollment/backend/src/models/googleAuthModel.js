const connection = require("../config/database");

const updateGoogleId = async (userId, googleId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET googleId = ? WHERE userId = ?",
      [googleId, userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const { v4: uuidv4 } = require("uuid");
const createUserWithGoogle = async (user) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (userId, googleId, userFullName, userEmail, userPhoneNumber, userPassword, userRole, userOtp, userOtpExpire)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sql,
      [
        user.userId || uuidv4(),
        user.googleId,
        user.userFullName,
        user.userEmail,
        user.userPhoneNumber || null,
        user.userPassword || "",
        user.userRole || "Student",
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

module.exports = { updateGoogleId, createUserWithGoogle };
