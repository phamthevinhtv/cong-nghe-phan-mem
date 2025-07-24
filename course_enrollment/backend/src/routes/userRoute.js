const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Lấy thông tin một user
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user cần lấy
 *     responses:
 *       200:
 *         description: Lấy thông tin user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Thiếu hoặc sai token xác thực
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy user
 */
router.get("/:userId", authenticateJWT, getUser);

/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     summary: Cập nhật thông tin user
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userFullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               userPhoneNumber:
 *                 type: string
 *                 example: 0123456789
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật thành công
 *                 user:
 *                   type: object
 *       400:
 *         description: Không có thay đổi nào được cập nhật
 *       401:
 *         description: Thiếu hoặc sai token xác thực
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy user
 */
router.put("/:userId", authenticateJWT, updateUser);

module.exports = router;
