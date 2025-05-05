const { createCourseDB, findCourseByName } = require('../models/courseModel')

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

module.exports = {
    createCourse
};
