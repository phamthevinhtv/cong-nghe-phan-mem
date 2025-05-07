const { enrollmentCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');

jest.mock('../models/courseModel');
jest.mock('../models/userModel');

describe('Kiểm thử chức năng enrollmentCourse', () => {
    const mockCourseData = {
        courseId: 'COURSE123',
        courseName: 'Khóa học giao tiếp',
        userId: 'TEACHER456',
        courseStatus: 'Publish',
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

    it('Phải đăng ký khóa học thành công khi người dùng là Admin', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.createEnrollment.mockResolvedValue();

        await enrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(courseModel.createEnrollment).toHaveBeenCalledWith('USER123', 'COURSE123');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký khóa học thành công.' });
    });

    it('Phải đăng ký khóa học thành công khi người dùng là Student', async () => {
        req.session.user = { userId: 'USER123', userRole: 'Student' };
        req.body = { courseId: 'COURSE123' };

        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.createEnrollment.mockResolvedValue();

        await enrollmentCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(userModel.findUserById).toHaveBeenCalledWith('USER123');
        expect(courseModel.createEnrollment).toHaveBeenCalledWith('USER123', 'COURSE123');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký khóa học thành công.' });
    });

    it('Phải đăng ký lại khóa học khi đã tồn tại bản ghi', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.createEnrollment.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
        courseModel.updateEnrollmentStatus.mockResolvedValue();

        await enrollmentCourse(req, res);

        expect(courseModel.updateEnrollmentStatus).toHaveBeenCalledWith('USER123', 'COURSE123', 'Enrolled');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký lại khóa học thành công.' });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Instructor';

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi khóa học không tồn tại', async () => {
        courseModel.findCourseById.mockResolvedValue(null);

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi khóa học chưa được publish', async () => {
        courseModel.findCourseById.mockResolvedValue({
            ...mockCourseData,
            courseStatus: 'Draft'
        });

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi khóa học không có userId (người tạo)', async () => {
        courseModel.findCourseById.mockResolvedValue({
            ...mockCourseData,
            userId: undefined
        });

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi học viên không tồn tại', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(null);

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Học viên không tồn tại.' });
    });

    it('Phải trả về lỗi khi đăng ký khóa học thất bại (ngoại trừ lỗi trùng lặp)', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        userModel.findUserById.mockResolvedValue(mockUserData);
        courseModel.createEnrollment.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await enrollmentCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký khóa học thất bại.' });
    });
});
