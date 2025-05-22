const express = require('express');
const { createCourse, getCourse, getCourses, updateCourse, deleteCourse, enrollmentCourse, cancelEnrollmentCourse, getStudentsEnrolled, createCourseCategory, getCourseCategories } = require('../controllers/courseController');
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
 * /api/course/course-categories:
 *   get:
 *     summary: Lấy danh sách danh mục khóa học (cần đăng nhập)
 *     tags:
 *       - Danh mục khóa học
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "CAT001"
 *                       courseCateName:
 *                         type: string
 *                         example: "Lập trình Web"
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
 *         description: Không tìm thấy danh mục nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Danh mục khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi lấy danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tìm danh mục khóa học thất bại."
 */
router.get('/course-categories', getCourseCategories);

/**
 * @swagger
 * /api/course/soon-to-start:
 *   get:
 *     summary: Lấy danh sách các khóa học sắp bắt đầu trong 3 ngày tới (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     responses:
 *       200:
 *         description: Lấy danh sách khóa học sắp bắt đầu thành công
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
 *                         example: "COURSE001"
 *                       courseName:
 *                         type: string
 *                         example: "Lập trình Node.js"
 *                       courseStartDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-23"
 *                       daysUntilStart:
 *                         type: integer
 *                         example: 2
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
 *         description: Không tìm thấy khóa học nào sắp bắt đầu
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
router.get('/soon-to-start-courses', getSoonToStartCourses);

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

/**
 * @swagger
 * /api/course/enroll-course:
 *   post:
 *     summary: Đăng ký khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "COURSE123"
 *               userId:
 *                 type: string
 *                 nullable: true
 *                 example: "USER123"
 *                 description: Chỉ cần khi người dùng là Admin, để đăng ký cho học viên khác
 *     responses:
 *       201:
 *         description: Đăng ký khóa học thành công hoặc đăng ký lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký khóa học thành công."
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
 *         description: Người dùng không có quyền truy cập (không phải Student hoặc Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Khóa học hoặc học viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi đăng ký khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký khóa học thất bại."
 */
router.post('/enroll-course', enrollmentCourse);

/**
 * @swagger
 * /api/course/cancel-enroll-course:
 *   post:
 *     summary: Hủy đăng ký khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "COURSE123"
 *               userId:
 *                 type: string
 *                 nullable: true
 *                 example: "USER123"
 *                 description: Chỉ cần khi người dùng là Admin, để hủy đăng ký cho học viên khác
 *     responses:
 *       201:
 *         description: Hủy đăng ký khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hủy đăng ký khóa học thành công."
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
 *         description: Người dùng không có quyền truy cập (không phải Student hoặc Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản này không có quyền truy cập."
 *       404:
 *         description: Khóa học hoặc học viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Khóa học không tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi hủy đăng ký khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hủy đăng ký khóa học thất bại."
 */
router.post('/cancel-enroll-course', cancelEnrollmentCourse);

/**
 * @swagger
 * /api/course/create-course-category:
 *   post:
 *     summary: Tạo danh mục khóa học (cần đăng nhập)
 *     tags:
 *       - Danh mục khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseCateName
 *             properties:
 *               courseCateName:
 *                 type: string
 *                 example: "Lập trình Web"
 *     responses:
 *       201:
 *         description: Tạo danh mục khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo danh mục khóa học thành công."
 *                 courseCateName:
 *                   type: string
 *                   example: "Lập trình Web"
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
 *       409:
 *         description: Tên danh mục đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên danh mục khóa học đã tồn tại."
 *       500:
 *         description: Lỗi phía máy chủ khi tạo danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo danh mục khóa học thất bại."
 */
router.post('/create-course-category', createCourseCategory);

/**
 * @swagger
 * /api/course/{courseId}:
 *   delete:
 *     summary: Xóa khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID của khóa học cần xóa
 *         schema:
 *           type: string
 *           example: "COURSE123"
 *     responses:
 *       200:
 *         description: Xóa khóa học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa khóa học thành công."
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
 *         description: Người dùng không có quyền truy cập (không phải Admin hoặc Instructor sở hữu)
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
 *       422:
 *         description: Không thể xóa khóa học đã được đăng ký hoặc đã công bố
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không thể xóa khóa học đã được đăng ký."
 *       500:
 *         description: Lỗi phía máy chủ khi xóa khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa khóa học thất bại."
 */
router.delete('/:courseId', deleteCourse);

/**
 * @swagger
 * /api/course/{courseId}/students:
 *   get:
 *     summary: Lấy danh sách học viên đã đăng ký khóa học (cần đăng nhập)
 *     tags:
 *       - Khóa học
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID của khóa học
 *         schema:
 *           type: string
 *           example: "COURSE123"
 *     responses:
 *       200:
 *         description: Lấy danh sách học viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "USER123"
 *                       fullName:
 *                         type: string
 *                         example: "Nguyễn Văn A"
 *                       email:
 *                         type: string
 *                         example: "student@example.com"
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
 *       404:
 *         description: Không tìm thấy học viên nào đăng ký khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tồn tại học viên đăng ký khóa học này."
 *       500:
 *         description: Lỗi phía máy chủ khi lấy danh sách học viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tìm học viên thất bại."
 */
router.get('/:courseId/students', getStudentsEnrolled);

module.exports = router;