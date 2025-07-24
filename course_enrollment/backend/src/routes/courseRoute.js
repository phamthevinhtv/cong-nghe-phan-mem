const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
  createCategory,
  createCourse,
  getAllCategories,
  getAllCourses,
  getCourse,
  enrollCourse,
  unenrollCourse,
  updateCourse,
  deleteCourse,
  getEnrolledStudents,
} = require("../controllers/courseController");

/**
 * @swagger
 * /api/course/{courseId}:
 *   put:
 *     summary: Cập nhật thông tin một khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseCategoryId:
 *                 type: string
 *                 example: null
 *               courseName:
 *                 type: string
 *                 example: Lập trình NodeJS
 *               courseImage:
 *                 type: string
 *                 example: nodejs.png
 *               courseDescription:
 *                 type: string
 *                 example: Khóa học thực hành NodeJS
 *               courseDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-01
 *               courseDuration:
 *                 type: string
 *                 example: "08:00 - 10:00"
 *               courseLocation:
 *                 type: string
 *                 example: "https://zoom.us/j/123456789"
 *               coursePlatform:
 *                 type: string
 *                 example: "Zoom"
 *               courseMaxStudent:
 *                 type: integer
 *                 example: 30
 *               coursePrice:
 *                 type: number
 *                 example: 1500000
 *               courseStatus:
 *                 type: string
 *                 enum: [Publish, Draft]
 *                 example: Draft
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
 *                   example: Cập nhật khóa học thành công
 *                 course:
 *                   type: object
 *       400:
 *         description: Không có thay đổi nào được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có thay đổi nào được cập nhật
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập
 */
router.put("/:courseId", authenticateJWT, updateCourse);

/**
 * @swagger
 * /api/course/category:
 *   post:
 *     summary: Tạo danh mục khóa học mới
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseCategoryName:
 *                 type: string
 *                 example: Lập trình
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo danh mục thành công
 *                 category:
 *                   type: object
 *       400:
 *         description: Danh mục đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Danh mục đã tồn tại
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập
 */
router.post("/category", authenticateJWT, createCategory);

/**
 * @swagger
 * /api/course/category:
 *   get:
 *     summary: Lấy tất cả danh mục khóa học
 *     tags: [Khóa học]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/category", getAllCategories);

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Tạo khóa học mới
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseCategoryId
 *               - courseName
 *             properties:
 *               courseCategoryId:
 *                 type: string
 *                 example: null
 *               courseName:
 *                 type: string
 *                 example: Lập trình NodeJS
 *               courseImage:
 *                 type: string
 *                 example: nodejs.png
 *               courseDescription:
 *                 type: string
 *                 example: Khóa học thực hành NodeJS
 *               courseDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-01
 *               courseDuration:
 *                 type: string
 *                 example: "08:00 - 10:00"
 *               courseLocation:
 *                 type: string
 *                 example: "https://zoom.us/j/123456789"
 *               coursePlatform:
 *                 type: string
 *                 example: "Zoom"
 *               courseMaxStudent:
 *                 type: integer
 *                 example: 30
 *               coursePrice:
 *                 type: number
 *                 example: 1500000
 *               courseStatus:
 *                 type: string
 *                 enum: [Publish, Draft]
 *                 example: Draft
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
 *                   example: Tạo khóa học thành công
 *                 course:
 *                   type: object
 *       400:
 *         description: Tên khóa học đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tên khóa học đã tồn tại
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập
 */
router.post("/", authenticateJWT, createCourse);

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Lấy tất cả khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
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
 *                       isEnrolled:
 *                         type: boolean
 *                         description: Học sinh đã đăng ký khóa học này chưa
 *                       currentStudent:
 *                         type: integer
 *                         description: Số lượng học viên đã đăng ký
 *       401:
 *         description: Thiếu hoặc sai token xác thực
 */
router.get("/", (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    req.user = { userRole: "Guest" };
    return require("../controllers/courseController").getAllCourses(
      req,
      res,
      next
    );
  }
  return authenticateJWT(req, res, () => {
    require("../controllers/courseController").getAllCourses(req, res, next);
  });
});

/**
 * @swagger
 * /api/course/{courseId}:
 *   get:
 *     summary: Lấy thông tin một khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần lấy
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
 *                   properties:
 *                     isEnrolled:
 *                       type: boolean
 *                       description: Học sinh đã đăng ký khóa học này chưa
 *                     currentStudent:
 *                       type: integer
 *                       description: Số lượng học viên đã đăng ký
 *       401:
 *         description: Thiếu hoặc sai token xác thực
 *       404:
 *         description: Không tìm thấy khóa học hoặc không đủ quyền
 */
router.get("/:courseId", (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    req.user = { userRole: "Guest" };
    return require("../controllers/courseController").getCourse(req, res, next);
  }
  return authenticateJWT(req, res, () => {
    require("../controllers/courseController").getCourse(req, res, next);
  });
});

/**
 * @swagger
 * /api/course/{courseId}/enroll:
 *   post:
 *     summary: Đăng ký khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần đăng ký
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng ký khóa học thành công
 *       400:
 *         description: Lỗi đăng ký, đã đăng ký, khóa học đã bắt đầu hoặc đã đủ số lượng học viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Khóa học đã đủ số lượng học viên, không thể đăng ký thêm
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập.
 */
router.post("/:courseId/enroll", authenticateJWT, enrollCourse);

/**
 * @swagger
 * /api/course/{courseId}/enroll:
 *   delete:
 *     summary: Hủy đăng ký khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần hủy đăng ký
 *     responses:
 *       200:
 *         description: Hủy đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hủy đăng ký khóa học thành công
 *       400:
 *         description: Lỗi hủy đăng ký, chưa đăng ký hoặc khóa học đã bắt đầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bạn chưa đăng ký khóa học này hoặc khóa học đã bắt đầu
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập.
 */
router.delete("/:courseId/enroll", authenticateJWT, unenrollCourse);

/**
 * @swagger
 * /api/course/{courseId}:
 *   delete:
 *     summary: Xóa một khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học cần xóa
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
 *                   example: Xóa khóa học thành công
 *       400:
 *         description: Không thể xóa khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không thể xóa khóa học này
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập
 */
router.delete("/:courseId", authenticateJWT, deleteCourse);

/**
 * @swagger
 * /api/course/{courseId}/students:
 *   get:
 *     summary: Lấy danh sách học viên đã đăng ký khóa học
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
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
 *                       userFullName:
 *                         type: string
 *                       userEmail:
 *                         type: string
 *                       userPhoneNumber:
 *                         type: string
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không có quyền truy cập.
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi server.
 */
router.get("/:courseId/students", authenticateJWT, getEnrolledStudents);

module.exports = router;
