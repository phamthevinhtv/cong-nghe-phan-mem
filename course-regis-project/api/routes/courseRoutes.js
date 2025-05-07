const express = require('express');
const { createCourse, getCourse, getCourses, updateCourse } = require('../controllers/courseController');
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

/**
 * @swagger
 * /api/course/courses:
 *   get:
 *     summary: Lấy danh sách khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     responses:
 *       200:
 *         description: Lấy danh sách khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         example: "COURSE123"
 *                       courseName:
 *                         type: string
 *                         example: "Khóa học giao tiếp"
 *                       courseDescription:
 *                         type: string
 *                         example: "Khóa học giúp cải thiện kỹ năng giao tiếp"
 *                       courseCategoryId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       courseStartDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-15"
 *                       courseEndDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-29"
 *                       courseMaxStudent:
 *                         type: integer
 *                         example: 30
 *                       coursePrice:
 *                         type: number
 *                         example: 0
 *                       courseStatus:
 *                         type: string
 *                         enum: ["Draft", "Publish"]
 *                         example: "Publish"
 *                       userId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       totalEnrollments:
 *                         type: integer
 *                         example: 10
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
 *         description: Người dùng không có quyền truy cập (không phải Admin, Instructor, hoặc Student)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Không tìm thấy khóa học nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi lấy danh sách khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tìm khóa học thất bại."
 */
router.get('/courses', getCourses);

/**
 * @swagger
 * /api/course/{courseId}:
 *   put:
 *     summary: Cập nhật thông tin khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID của khóa học cần cập nhật
 *         schema:
 *           type: string
 *           example: "COURSE123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: "Khóa học giao tiếp nâng cao"
 *               courseDescription:
 *                 type: string
 *                 example: "Khóa học cải thiện giao tiếp chuyên sâu"
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
 *                 description: Chỉ Admin có thể cập nhật userId
 *     responses:
 *       200:
 *         description: Cập nhật khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công."
 *                 course:
 *                   type: object
 *                   properties:
 *                     courseName:
 *                       type: string
 *                       example: "Khóa học giao tiếp nâng cao"
 *                     courseDescription:
 *                       type: string
 *                       example: "Khóa học cải thiện giao tiếp chuyên sâu"
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
 *         description: Người dùng không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Khóa học không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi cập nhật khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thất bại."
 */
router.put('/:courseId', updateCourse);

/**
 * @swagger
 * /api/course/{courseId}:
 *   get:
 *     summary: Lấy thông tin khóa học theo ID (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID của khóa học cần lấy thông tin
 *         schema:
 *           type: string
 *           example: "COURSE123"
 *     responses:
 *       200:
 *         description: Lấy thông tin khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   type: object
 *                   oneOf:
 *                     - properties: # Cho Admin hoặc Instructor sở hữu
 *                         courseId:
 *                           type: string
 *                           example: "COURSE123"
 *                         courseName:
 *                           type: string
 *                           example: "Khóa học giao tiếp"
 *                         courseDescription:
 *                           type: string
 *                           example: "Khóa học giúp cải thiện kỹ năng giao tiếp"
 *                         courseCategoryId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         courseStartDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-05-15"
 *                         courseEndDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-05-29"
 *                         courseMaxStudent:
 *                           type: integer
 *                           example: 30
 *                         coursePrice:
 *                           type: number
 *                           example: 0
 *                         courseStatus:
 *                           type: string
 *                           enum: ["Draft", "Publish"]
 *                         userId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         courseCreatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-01T12:00:00Z"
 *                         courseUpdatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-10T15:30:00Z"
 *                         totalEnrollments:
 *                           type: integer
 *                           example: 10
 *                     - properties: # Cho Student (khóa học Publish)
 *                         courseId:
 *                           type: string
 *                           example: "COURSE123"
 *                         courseName:
 *                           type: string
 *                           example: "Khóa học giao tiếp"
 *                         courseDescription:
 *                           type: string
 *                           example: "Khóa học giúp cải thiện kỹ năng giao tiếp"
 *                         courseStartDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-05-15"
 *                         courseEndDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-05-29"
 *                         courseMaxStudent:
 *                           type: integer
 *                           example: 30
 *                         coursePrice:
 *                           type: number
 *                           example: 0
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
 *         description: Người dùng không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Khóa học không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi tìm khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tìm khóa học thất bại."
 */
router.get('/:courseId', getCourse);

module.exports = router;