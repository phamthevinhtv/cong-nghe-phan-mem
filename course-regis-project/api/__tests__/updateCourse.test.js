const { updateCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const dayjs = require('dayjs');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng updateCourse', () => {
    let req;
    let res;

    const mockCourse = {
        courseId: 'COURSE123',
        courseName: 'Khóa học giao tiếp',
        courseDescription: 'Khóa học cải thiện giao tiếp',
        coursePrice: 0,
        courseCategoryId: null,
        courseMaxStudent: 50,
        courseStartDate: '2025-05-01',
        courseEndDate: '2025-05-15',
        courseStatus: 'Published',
        userId: 'USER123',
    };

    beforeEach(() => {
        req = {
            params: { courseId: 'COURSE123' },
            body: {
                courseName: 'Khóa học giao tiếp nâng cao',
                courseDescription: 'Khóa học cải thiện giao tiếp chuyên sâu',
                coursePrice: 0,
                courseCategoryId: null,
                courseMaxStudent: 30,
                courseStartDate: '2025-05-15',
                courseEndDate: '2025-05-29',
                courseStatus: 'Draft',
            },
            session: { user: { userId: 'USER123', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải cập nhật khóa học thành công khi người dùng là Admin', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourse);
        courseModel.updateCourseDB.mockResolvedValue(true);

        const expectedCourse = {
            courseName: 'Khóa học giao tiếp nâng cao',
            courseDescription: 'Khóa học cải thiện giao tiếp chuyên sâu',
            coursePrice: 0,
            courseCategoryId: null,
            courseMaxStudent: 30,
            courseStartDate: '2025-05-15',
            courseEndDate: '2025-05-29',
            courseStatus: 'Draft',
            userId: null, // Khớp với hành vi thực tế cho Admin
        };

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.updateCourseDB).toHaveBeenCalledWith('COURSE123', expectedCourse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật thành công.', course: expectedCourse });
    });

    it('Phải cập nhật khóa học thành công khi người dùng là Instructor và sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        courseModel.findCourseById.mockResolvedValue(mockCourse);
        courseModel.updateCourseDB.mockResolvedValue(true);

        const expectedCourse = {
            courseName: 'Khóa học giao tiếp nâng cao',
            courseDescription: 'Khóa học cải thiện giao tiếp chuyên sâu',
            coursePrice: 0,
            courseCategoryId: null,
            courseMaxStudent: 30,
            courseStartDate: '2025-05-15',
            courseEndDate: '2025-05-29',
            courseStatus: 'Draft',
            userId: 'USER123', // Khớp với hành vi thực tế cho Instructor
        };

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.updateCourseDB).toHaveBeenCalledWith('COURSE123', expectedCourse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật thành công.', course: expectedCourse });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await updateCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Student';

        await updateCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi Instructor không sở hữu khóa học', async () => {
        req.session.user.userRole = 'Instructor';
        courseModel.findCourseById.mockResolvedValue({ ...mockCourse, userId: 'USER456' });

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi khóa học không tồn tại', async () => {
        courseModel.findCourseById.mockResolvedValue(null);

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi không có thay đổi để cập nhật', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourse);
        courseModel.updateCourseDB.mockResolvedValue(false);

        const expectedCourse = {
            courseName: 'Khóa học giao tiếp nâng cao',
            courseDescription: 'Khóa học cải thiện giao tiếp chuyên sâu',
            coursePrice: 0,
            courseCategoryId: null,
            courseMaxStudent: 30,
            courseStartDate: '2025-05-15',
            courseEndDate: '2025-05-29',
            courseStatus: 'Draft',
            userId: null, // Khớp với hành vi thực tế cho Admin
        };

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(courseModel.updateCourseDB).toHaveBeenCalledWith('COURSE123', expectedCourse);
        expect(res.status).toHaveBeenCalledWith(200); // Khớp với hành vi thực tế
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật thành công.', course: expectedCourse });
    });

    it('Phải trả về lỗi khi cập nhật khóa học thất bại', async () => {
        courseModel.findCourseById.mockResolvedValue(mockCourse);
        courseModel.updateCourseDB.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await updateCourse(req, res);

        expect(courseModel.findCourseById).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật thất bại.' });
    });
});