const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Lỗi khi khởi động server: ${err.message}`);
    } else {
        console.log(`Server đang chạy trên: http://localhost:${PORT}`);
    }
});
