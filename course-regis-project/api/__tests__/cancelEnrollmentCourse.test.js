const { cancelEnrollmentCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');

jest.mock('../models/courseModel');
jest.mock('../models/userModel');

describe('Kiểm thử chức năng cancelEnrollmentCourse', () => {
    const mockCourseData = {
        courseId: 'COURSE123',
        courseName: 'Khóa học giao tiếp',
        studentId: 'USER123',
        enrollmentStatus: 'Enrolled',
    };

    const mockUserData = {
        userId: 'USER123',
        userFullName: 'Nguyễn Văn A',
    };

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: { courseId: 'COURSE123', userId: 'USER123' },
            session: { user: { userId: 'ADMIN123', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải hủy đăng ký khóa học thành công khi người dùng là Admin', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.updateEnrollmentStatus.mockResolvedValue();

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(courseModel.updateEnrollmentStatus).toHaveBeenCalledWith('USER123', 'COURSE123', 'Canceled');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hủy đăng ký khóa học thành công.' });
    });

    it('Phải hủy đăng ký khóa học thành công khi người dùng là Student', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'USER123';
        req.body = { courseId: 'COURSE123' };
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.updateEnrollmentStatus.mockResolvedValue();

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(courseModel.updateEnrollmentStatus).toHaveBeenCalledWith('USER123', 'COURSE123', 'Canceled');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hủy đăng ký khóa học thành công.' });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await cancelEnrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Instructor';

        await cancelEnrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi khóa học không tồn tại', async () => {
        courseModel.findCourseById.mockResolvedValue(null);

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi học viên không tồn tại', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'USER123';
        req.body = { courseId: 'COURSE123' };
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(null);

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Học viên không tồn tại.' });
    });

    it('Phải trả về lỗi khi trạng thái đăng ký không phải Enrolled cho Student', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'USER123';
        req.body = { courseId: 'COURSE123' };
        courseModel.findCourseById.mockResolvedValue({ ...mockCourseData, enrollmentStatus: 'Canceled' });

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi hủy đăng ký khóa học thất bại cho Student', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'USER123';
        req.body = { courseId: 'COURSE123' };
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.updateEnrollmentStatus.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await cancelEnrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(courseModel.updateEnrollmentStatus).toHaveBeenCalledWith('USER123', 'COURSE123', 'Canceled');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hủy đăng ký khóa học thất bại.' });
    });
});