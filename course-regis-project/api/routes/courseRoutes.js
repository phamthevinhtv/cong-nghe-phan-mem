const express = require('express');
const { createCourse } = require('../controllers/courseController');
const router = express.Router();

/**
 * @swagger
 * /api/course/create-course:
 *   post:
 *     summary: Tạo khóa học mới (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - courseDescription
 *               - coursePrice
 *               - courseMaxStudent
 *               - courseStartDate
 *               - courseEndDate
 *               - courseStatus
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: "Khóa học giao tiếp"
 *               courseDescription:
 *                 type: string
 *                 example: "Khóa học giúp cải thiện kỹ năng giao tiếp"
 *               courseCategoryId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               courseStartDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *               courseEndDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-29"
 *               courseMaxStudent:
 *                 type: integer
 *                 example: 30
 *               coursePrice:
 *                 type: number
 *                 example: 0
 *               courseStatus:
 *                 type: string
 *                 enum: ["Draft", "Publish"]
 *                 example: "Draft"
 *               userId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: Chỉ Admin có thể chỉ định userId, Instructor tự động sử dụng userId của mình
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo khóa học thành công."
 *                 course:
 *                   type: object
 *                   properties:
 *                     courseName:
 *                       type: string
 *                       example: "Khóa học giao tiếp"
 *                     courseDescription:
 *                       type: string
 *                       example: "Khóa học giúp cải thiện kỹ năng giao tiếp"
 *                     courseCategoryId:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     courseStartDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-05-15"
 *                     courseEndDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-05-29"
 *                     courseMaxStudent:
 *                       type: integer
 *                       example: 30
 *                     coursePrice:
 *                       type: number
 *                       example: 0
 *                     courseStatus:
 *                       type: string
 *                       example: "Draft"
 *                     userId:
 *                       type: string
 *                       nullable: true
 *                       example: null
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
 *         description: Người dùng không có quyền truy cập (không phải Admin hoặc Instructor)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       409:
 *         description: Tên khóa học đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên khóa học đã tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi tạo khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo khóa học thất bại."
 */
router.post('/create-course', createCourse);

module.exports = router;