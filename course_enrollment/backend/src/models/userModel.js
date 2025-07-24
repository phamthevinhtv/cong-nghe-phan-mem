const connection = require("../config/database");

const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE userId = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const updateUserById = async (userId, data) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    for (const key in data) {
      if (
        key !== "userId" &&
        key !== "userPassword" &&
        data[key] !== undefined
      ) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return resolve(null);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE userId = ?`;
    values.push(userId);
    connection.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  findUserById,
  updateUserById,
};
