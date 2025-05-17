const { createCourseDB, findCourseByName, findCourseById, findCourses, updateCourseDB, deleteCourseDB, createEnrollment, updateEnrollmentStatus, findStudentsByCourseId, findCourseCategories, findCourseCategoryByName, createCourseCategoryDB } = require('../models/courseModel');
const { findUserById } = require('../models/userModel');
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

const getCourses = async (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor" && currentUser.userRole != "Student") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        let courses = await findCourses();
        if (courses.length <= 0) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        if (currentUser.userRole == "Instructor") {
            courses = courses.filter(course => course.userId == currentUser.userId);
        } else if (currentUser.userRole == "Student") {
            courses = courses.filter(course => (course.courseStatus == 'Publish' && course.userId) || course.studentId == currentUser.userId);
        }
        courses = courses.map((course) => ({
            ...course,
            courseStartDate: dayjs(course.courseStartDate).isValid() ? dayjs(course.courseStartDate).format('YYYY-MM-DD') : '',
            courseEndDate: dayjs(course.courseEndDate).isValid() ? dayjs(course.courseEndDate).format('YYYY-MM-DD') : ''
        }));
        res.status(200).json({ courses: courses });
    } catch (err) {
        res.status(500).json({ message: 'Tìm khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseData = req.body;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if(currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        const newCourse = {};
        let count = 0;
        const course = await findCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        if(currentUser.userRole == "Admin") {
            if (!courseData.userId) {
                newCourse.userId = null;
            } else if (courseData.userId && course.userId != courseData.userId) {
                newCourse.userId = courseData.userId;
                count++;
            } else {
                newCourse.userId = course.userId;
            }
        } else {
            if(currentUser.userRole == "Instructor" && currentUser.userId != course.userId) {
                return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
            }
            newCourse.userId = course.userId;
        }
        if (!courseData.courseCategoryId) {
            newCourse.courseCategoryId = null;
        } else if (courseData.courseCategoryId && course.courseCategoryId != courseData.courseCategoryId) {
            newCourse.courseCategoryId = courseData.courseCategoryId;
            count++;
        } else {
            newCourse.courseCategoryId = course.courseCategoryId;
        }
        if (courseData.courseName && course.courseName != courseData.courseName) {
            newCourse.courseName = courseData.courseName;
            count++;
        } else {
            newCourse.courseName = course.courseName;
        }
        if (courseData.courseDescription && course.courseDescription != courseData.courseDescription) {
            newCourse.courseDescription = courseData.courseDescription;
            count++;
        } else {
            newCourse.courseDescription = course.courseDescription;
        }
        const courseStartA = dayjs(course.courseStartDate);
        const courseStartB = dayjs(courseData.courseStartDate);
        if (courseData.courseStartDate && courseStartB.isValid() && courseStartA.isValid() &&
            courseStartA.format('YYYY-MM-DD') !== courseStartB.format('YYYY-MM-DD')) {
            newCourse.courseStartDate = courseStartB.format('YYYY-MM-DD');
            count++;
        } else {
            newCourse.courseStartDate = courseStartA.isValid() ? courseStartA.format('YYYY-MM-DD') : '';
        }
        const courseEndA = dayjs(course.courseEndDate);
        const courseEndB = dayjs(courseData.courseEndDate);
        if (courseData.courseEndDate && courseEndB.isValid() && courseEndA.isValid() &&
            courseEndA.format('YYYY-MM-DD') !== courseEndB.format('YYYY-MM-DD')) {
            newCourse.courseEndDate = courseEndB.format('YYYY-MM-DD');
            count++;
        } else {
            newCourse.courseEndDate = courseEndA.isValid() ? courseEndA.format('YYYY-MM-DD') : '';
        }
        if (courseData.courseMaxStudent && Number(course.courseMaxStudent) != Number(courseData.courseMaxStudent)) {
            newCourse.courseMaxStudent = Number(courseData.courseMaxStudent);
            count++;
        } else {
            newCourse.courseMaxStudent = Number(course.courseMaxStudent);
        }
        if (courseData.coursePrice && Number(course.coursePrice) != Number(courseData.coursePrice)) {
            newCourse.coursePrice = Number(courseData.coursePrice);
            count++;
        } else {
            newCourse.coursePrice = Number(course.coursePrice);
        }
        if (courseData.courseStatus && course.courseStatus != courseData.courseStatus) {
            newCourse.courseStatus = courseData.courseStatus;
            count++;
        } else {
            newCourse.courseStatus = course.courseStatus;
        }
        if (count == 0) {
            return res.status(400).json({ message: 'Không có thay đổi để cập nhật.' });
        }
        await updateCourseDB(courseId, newCourse);
        res.status(200).json({ message: 'Cập nhật thành công.', course: newCourse });
    } catch (err) {
        res.status(500).json({ message: 'Cập nhật thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if(currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        const course = await findCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        if((currentUser.userRole == "Instructor" && course.userId != currentUser.userId)) {
            return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
        } else if(course.totalEnrollments > 0) {
            return res.status(422).json({ message: 'Không thể xóa khóa học đã được đăng ký.' });            
        } if(course.courseStatus == 'Publish') {
            return res.status(422).json({ message: 'Không thể xóa khóa học đã được công bố.' });
        } else {
            await deleteCourseDB(course.courseId);
            res.status(200).json({ message: 'Xóa khóa học thành công.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Xóa khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const enrollmentCourse = async (req, res) => {
    const { courseId, userId } = req.body;
    const currentUser = req.session.user;
    let studentId = '';
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Student" && currentUser.userRole != "Admin") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    if (currentUser.userRole == "Admin") {
        studentId = userId;
    } else {
        studentId = currentUser.userId;
    }
    try {
        const course = await findCourseById(courseId);
        if (!course || !course.userId || course.courseStatus != 'Publish') {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        const student = await findUserById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Học viên không tồn tại.' });
        }
        await createEnrollment(studentId, courseId);
        res.status(201).json({ message: 'Đăng ký khóa học thành công.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            try {
                await updateEnrollmentStatus(studentId, courseId, "Enrolled");
                res.status(201).json({ message: 'Đăng ký lại khóa học thành công.' });
            } catch (err) {
                throw err;
            }
        } else {
            res.status(500).json({ message: 'Đăng ký khóa học thất bại.' });
        }
        console.error(`Lỗi: ${err.message}`);
    }
};

const cancelEnrollmentCourse = async (req, res) => {
    const { courseId, userId } = req.body;
    const currentUser = req.session.user;
    let studentId = '';
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole !== "Student" && currentUser.userRole !== "Admin") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    if (currentUser.userRole === "Admin") {
        studentId = userId;
    } else {
        studentId = currentUser.userId;
    }
    try {
        const course = await findCourseById(courseId);
        if (!course || (currentUser.userRole === "Student" && (course.studentId !== studentId || course.enrollmentStatus !== 'Enrolled'))) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' });
        }
        const student = await findUserById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Học viên không tồn tại.' });
        }
        await updateEnrollmentStatus(studentId, courseId, "Canceled");
        res.status(201).json({ message: 'Hủy đăng ký khóa học thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Hủy đăng ký khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const getStudentsEnrolled = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        const students = await findStudentsByCourseId(courseId);
        if (students.length <= 0) {
            return res.status(404).json({ message: 'Không tồn tại học viên đăng ký khóa học này.' });
        }
        res.status(200).json({ students: students });
    } catch (err) {
        res.status(500).json({ message: 'Tìm học viên thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const createCourseCategory = async (req, res) => {
    const { courseCateName } = req.body;
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        const course = await findCourseCategoryByName(courseCateName);
        if (course) {
            return res.status(409).json({ message: 'Tên danh mục khóa học đã tồn tại.' });
        }
        await createCourseCategoryDB(courseCateName);
        res.status(201).json({ message: 'Tạo danh mục khóa học thành công.', courseCateName: courseCateName });
    } catch (err) {
        res.status(500).json({ message: 'Tạo danh mục khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

const getCourseCategories = async (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).json({ message: 'Cần đăng nhập để có quyền truy cập.' });
    }
    if (currentUser.userRole != "Admin" && currentUser.userRole != "Instructor") {
        return res.status(403).json({ message: 'Tài khoản này không có quyền truy cập.' });
    }
    try {
        let courseCategories = await findCourseCategories();
        if (courseCategories.length <= 0) {
            return res.status(404).json({ message: 'Danh mục khóa học không tồn tại.' });
        }
        res.status(200).json({ courseCategories: courseCategories });
    } catch (err) {
        res.status(500).json({ message: 'Tìm danh mục khóa học thất bại.' });
        console.error(`Lỗi: ${err.message}`);
    }
};

module.exports = {
    createCourse,
    getCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    enrollmentCourse,
    cancelEnrollmentCourse,
    getStudentsEnrolled,
    createCourseCategory,
    getCourseCategories
};
