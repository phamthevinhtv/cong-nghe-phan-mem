const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID (cần đăng nhập)
 *     tags:
 *       - Người dùng
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của người dùng cần lấy thông tin
 *         schema:
 *           type: string
 *           example: "TELyABACJYOOBlT-CHZB"
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "TELyABACJYOOBlT-CHZB"
 *                     userFullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     userEmail:
 *                       type: string
 *                       example: "example@fake.com"
 *                     userGender:
 *                       type: string
 *                       example: "Nam"
 *                     userPhoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     userAddress:
 *                       type: string
 *                       example: "123, ABC, Phường 5, Tp. Trà Vinh"
 *                     googleId:
 *                       type: string
 *                       example: "104738273462837462837"
 *                     userRole:
 *                       type: string
 *                       example: "Admin"
 *                     userStatus:
 *                       type: string
 *                       example: "active"
 *                     userCreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-01T12:00:00Z"
 *                     userUpdatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-10T15:30:00Z"
 *       401:
 *         description: Người dùng chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cần đăng nhập để có quyền truy cập."
 *       403:
 *         description: Người dùng không có quyền truy cập vào tài nguyên này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Không tìm thấy tài khoản theo ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi tìm tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tìm tài khoản thất bại."
 */
router.get('/:userId', userController.getUser);

/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     summary: Cập nhật thông tin người dùng (cần đăng nhập)
 *     tags:
 *       - Người dùng
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của người dùng cần cập nhật
 *         schema:
 *           type: string
 *           example: "TELyABACJYOOBlT-CHZB"
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
 *               - userRole
 *               - userStatus
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
 *               userRole:
 *                 type: string
 *                 example: "Student"
 *               userStatus:
 *                 type: string
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công."
 *                 user:
 *                   type: object
 *                   properties:
 *                     userFullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     userEmail:
 *                       type: string
 *                       example: "example@fake.com"
 *                     userPassword:
 *                       type: string
 *                       example: "12345678"
 *                     userGender:
 *                       type: string
 *                       example: "Nam"
 *                     userPhoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     userAddress:
 *                       type: string
 *                       example: "123, ABC, Phường 5, Tp. Trà Vinh"
 *                     userRole:
 *                       type: string
 *                       example: "Student"
 *                     userStatus:
 *                       type: string
 *                       example: "Active"
 *       400:
 *         description: Không có thay đổi để cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không có thay đổi để cập nhật."
 *       403:
 *         description: Người dùng không có quyền truy cập vào tài nguyên này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Tài khoản không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản không tồn tại."
 *       500:
 *         description: Cập nhật thông tin người dùng thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thất bại."
 */
router.put('/:userId', userController.updateUser);

module.exports = router;
