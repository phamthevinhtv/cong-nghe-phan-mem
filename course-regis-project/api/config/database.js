const mysql = require('mysql2/promise');
require('dotenv').config();

async function getConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Kết nối database thành công.');
        return connection;
    } catch (err) {
        console.error(`Lỗi kết nối database: ${err.message}`);
    }
}

async function closeConnection(connection) {
  if (connection) {
      try {
          await connection.end();
          console.log('Đóng kết nối database thành công.');
      } catch (err) {
          console.error(`Lỗi khi đóng kết nối database: ${err.message}`);
      }
  }
}

module.exports = {
  getConnection,
  closeConnection
};