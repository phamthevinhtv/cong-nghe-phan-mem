// require('dotenv').config();
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

// connection.connect(err => {
//   if (err) {
//     console.error('Kết nối MySQL thất bại:', err.message);
//   } else {
//     console.log('Kết nối MySQL thành công.');
//   }
// });

// module.exports = connection;
require("dotenv").config();
const mysql = require("mysql2");
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = connection;
