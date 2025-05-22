const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const swaggerDocs = require('./config/swagger');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
require('./utils/cronJobs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    }
}));

swaggerDocs(app);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Lỗi khi khởi động server: ${err.message}`);
    } else {
        console.log(`Server đang chạy trên: http://localhost:${PORT}`);
    }
});
