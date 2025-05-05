const { getCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng getCourse', () => {
    const mockCourseData = {
        courseId: 'COURSE123',
        courseName: 'Khóa học giao tiếp',
        courseDescription: 'Khóa học giúp cải thiện kỹ năng giao tiếp',
        courseCategoryId: null,
        courseStartDate: '2025-05-15',
        courseEndDate: '2025-05-29',
        courseMaxStudent: 30,
        coursePrice: 0,
        courseStatus: 'Publish',
        userId: 'USER123',
        courseCreatedAt: '2025-05-01T12:00:00Z',
        courseUpdatedAt: '2025-05-01T12:00:00Z',
        userFullName: 'Nguyễn Văn A',
        courseCategoryName: 'Giao tiếp',
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

    it('Phải trả về thông tin khóa học khi người dùng là Admin', async () => {
        const expectedCourse = { ...mockCourseData };
        delete expectedCourse.userFullName;
        delete expectedCourse.courseCategoryName;
        courseModel.findCourseById.mockResolvedValue(mockCourseData);

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ course: expect.objectContaining(expectedCourse) });
    });

    it('Phải trả về thông tin khóa học khi người dùng là Instructor và sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        const expectedCourse = { ...mockCourseData };
        delete expectedCourse.userFullName;
        delete expectedCourse.courseCategoryName;
        courseModel.findCourseById.mockResolvedValue(mockCourseData);

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ course: expect.objectContaining(expectedCourse) });
    });

    it('Phải trả về thông tin khóa học hạn chế khi người dùng là Student và khóa học được xuất bản', async () => {
        req.session.user.userRole = 'Student';
        const expectedCourse = { ...mockCourseData };
        delete expectedCourse.userId;
        delete expectedCourse.courseCategoryId;
        delete expectedCourse.courseMaxStudent;
        delete expectedCourse.courseStatus;
        delete expectedCourse.courseCreatedAt;
        delete expectedCourse.courseUpdatedAt;
        courseModel.findCourseById.mockResolvedValue(mockCourseData);

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ course: expect.objectContaining(expectedCourse) });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await getCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Guest';

        await getCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi khóa học không tồn tại', async () => {
        courseModel.findCourseById.mockResolvedValue(null);

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi Instructor không sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        req.session.user.userId = 'USER456';
        courseModel.findCourseById.mockResolvedValue(mockCourseData);

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi Student truy cập khóa học chưa xuất bản', async () => {
        req.session.user.userRole = 'Student';
        courseModel.findCourseById.mockResolvedValue({ ...mockCourseData, courseStatus: 'Draft' });

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi tìm khóa học thất bại', async () => {
        courseModel.findCourseById.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await getCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tìm khóa học thất bại.' });
    });
});
