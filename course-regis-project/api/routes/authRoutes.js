const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags:
 *       - Xác thực
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userFullName
 *               - userEmail
 *               - userPassword
 *               - userGender
 *               - userPhoneNumber
 *               - userAddress
 *             properties:
 *               userFullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               userEmail:
 *                 type: string
 *                 example: "example@fake.com"
 *               userPassword:
 *                 type: string
 *                 example: "12345678"
 *               userGender:
 *                 type: string
 *                 example: "Nam"
 *               userPhoneNumber:
 *                 type: string
 *                 example: "0123456789"
 *               userAddress:
 *                 type: string
 *                 example: "123, ABC, Phường 5, Tp. Trà Vinh"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email đã tồn tại
 *       500:
 *         description: Đăng ký thất bại
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - Xác thực
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - userPassword
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: "example@fake.com"
 *               userPassword:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       201:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Email không tồn tại hoặc sai mật khẩu
 *       500:
 *         description: Đăng nhập thất bại
 */
router.post('/login', authController.login);

module.exports = router;
