const { deleteCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng deleteCourse', () => {
    const mockCourseData = {
        courseId: 'COURSE123',
        courseName: 'Khóa học giao tiếp',
        userId: 'USER123',
    };

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { courseId: 'COURSE123' },
            session: { user: { userId: 'USER123', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải xóa khóa học thành công khi người dùng là Admin', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        courseModel.deleteCourseDB.mockResolvedValue();

        await deleteCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.deleteCourseDB).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Xóa khóa học thành công.' });
    });

    it('Phải xóa khóa học thành công khi người dùng là Instructor và sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        courseModel.deleteCourseDB.mockResolvedValue();

        await deleteCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.deleteCourseDB).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Xóa khóa học thành công.' });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await deleteCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Student';

        await deleteCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi Instructor không sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        req.session.user.userId = 'USER456';
        courseModel.findCourseById.mockResolvedValue(mockCourseData);

        await deleteCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.deleteCourseDB).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi xóa khóa học thất bại', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourseData);
        courseModel.deleteCourseDB.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await deleteCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.deleteCourseDB).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Xóa khóa học thất bại.' });
    });
});