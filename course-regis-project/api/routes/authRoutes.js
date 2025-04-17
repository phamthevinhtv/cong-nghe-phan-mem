const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
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
 *               - userFullName
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
 *         description: Đăng ký tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký tài khoản thành công."
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email đã tồn tại."
 *       500:
 *         description: Đăng ký tài khoản thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký tài khoản thất bại."
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
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công.
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     userEmail:
 *                       type: string
 *                     userFullName:
 *                       type: string
 *                     userRole:
 *                       type: string
 *                     userStatus:
 *                       type: string
 *       401:
 *         description: Sai mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sai mật khẩu.
 *       403:
 *         description: Tài khoản bị khóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tài khoản này đã bị khóa.
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email không tồn tại.
 *       500:
 *         description: Đăng nhập thất bại (lỗi server)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thất bại.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/request-reset-password:
 *   post:
 *     summary: Gửi mã OTP yêu cầu đặt lại mật khẩu
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
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: "example@fake.com"
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mã OTP đã được gửi đến email của bạn.
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email không tồn tại.
 *       500:
 *         description: Yêu cầu đặt lại mật khẩu thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Yêu cầu đặt lại mật khẩu thất bại.
 */
router.post('/request-reset-password', authController.requestResetPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu với mã OTP
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
 *               - userOtp
 *               - userPassword
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: "example@fake.com"
 *               userOtp:
 *                 type: string
 *                 example: "nQGH1y"
 *               userPassword:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công.
 *       400:
 *         description: Mã OTP không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mã OTP không hợp lệ hoặc đã hết hạn.
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email không tồn tại.
 *       500:
 *         description: Đổi mật khẩu thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thất bại.
 */
router.post('/reset-password', authController.resetPassword);

router.get('/google', authController.googleLoginInit);
router.get('/google/callback', authController.googleLoginCallback);

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Kiểm tra phiên đăng nhập hiện tại
 *     tags:
 *       - Xác thực
 *     responses:
 *       200:
 *         description: Trạng thái đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "U1234567"
 *                     userEmail:
 *                       type: string
 *                       example: "example@fake.com"
 *                     userFullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     userRole:
 *                       type: string
 *                       example: "user"
 *                     userStatus:
 *                       type: string
 *                       example: "active"
 */
router.get('/session', authController.checkSession);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags:
 *       - Xác thực
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thành công.
 *       500:
 *         description: Đăng xuất thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thất bại.
 */
router.post('/logout', authController.logout);

module.exports = router;