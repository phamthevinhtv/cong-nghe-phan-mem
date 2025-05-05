const { createCourseDB, findCourseByName, findCourseById } = require('../models/courseModel');
const dayjs = require('dayjs');

const createCourse = async (req, res) => {
    const courseData = req.body;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    if (currentUser.userRole == "Instructor") {
        courseData.userId = currentUser.userId;
    }
    try {
        const course = await findCourseByName(courseData.courseName);
        if (course) {
            return res.status(409).json({ message: 'Tên khóa học đã tồn tại.' });
        }
        await createCourseDB(courseData);
        res.status(201).json({ message: 'Tạo khóa học thành công.', course: courseData });
    } catch (err) {
        res.status(500).json({ message: 'Tạo khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const getCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor" && currentUser.userRole != "Student") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        const course = await findCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        if (currentUser.userRole === 'Instructor' && course.userId !== currentUser.userId) {
            return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
        }
        if (currentUser.userRole === 'Student' && course.courseStatus !== 'Publish') {
            return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
        }
        if (currentUser.userRole == "Student") {
            delete course.userId;
            delete course.courseCategoryId;
            delete course.courseStatus;
            delete course.courseCreatedAt;
            delete course.courseUpdatedAt;
        }
        course.courseStartDate = dayjs(course.courseStartDate).isValid() ? dayjs(course.courseStartDate).format('YYYY-MM-DD') : '';
        course.courseEndDate = dayjs(course.courseEndDate).isValid() ? dayjs(course.courseEndDate).format('YYYY-MM-DD') : '';
        res.status(200).json({ course: course });
    } catch (err) {
        res.status(500).json({ message: 'Tìm khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

module.exports = {
    createCourse,
    getCourse
};
