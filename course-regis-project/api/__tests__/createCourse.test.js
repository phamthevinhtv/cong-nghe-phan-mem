const { createCourse } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng createCourse', () => {
    const mockCourseData = {
        courseName: 'Khóa học giao tiếp',
        courseDescription: 'Khóa học giúp cải thiện kỹ năng giao tiếp',
        courseCategoryId: null,
        courseStartDate: '2025-05-15',
        courseEndDate: '2025-05-29',
        courseMaxStudent: 30,
        coursePrice: 0,
        courseStatus: 'Draft',
        userId: null,
    };

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: mockCourseData,
            session: { user: { userId: 'USER123', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải tạo khóa học thành công khi dữ liệu hợp lệ và người dùng là Admin', async () => {
        courseModel.findCourseByName.mockResolvedValue(null);
        courseModel.createCourseDB.mockResolvedValue();

        await createCourse(req, res);

        expect(courseModel.findCourseByName).toHaveBeenCalledWith(mockCourseData.courseName);
        expect(courseModel.createCourseDB).toHaveBeenCalledWith(mockCourseData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tạo khóa học thành công.', course: mockCourseData });
    });

    it('Phải tạo khóa học thành công khi người dùng là Instructor và thêm userId', async () => {
        req.session.user.userRole = 'Instructor';
        const expectedCourseData = { ...mockCourseData, userId: 'USER123' };
        courseModel.findCourseByName.mockResolvedValue(null);
        courseModel.createCourseDB.mockResolvedValue();

        await createCourse(req, res);

        expect(courseModel.findCourseByName).toHaveBeenCalledWith(mockCourseData.courseName);
        expect(courseModel.createCourseDB).toHaveBeenCalledWith(expectedCourseData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tạo khóa học thành công.', course: expectedCourseData });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await createCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền (không phải Admin hoặc Instructor)', async () => {
        req.session.user.userRole = 'Student';

        await createCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi tên khóa học đã tồn tại', async () => {
        courseModel.findCourseByName.mockResolvedValue({ courseName: mockCourseData.courseName });

        await createCourse(req, res);

        expect(courseModel.findCourseByName).toHaveBeenCalledWith(mockCourseData.courseName);
        expect(courseModel.createCourseDB).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tên khóa học đã tồn tại.' });
    });

    it('Phải trả về lỗi khi tạo khóa học thất bại', async () => {
        courseModel.findCourseByName.mockResolvedValue(null);
        courseModel.createCourseDB.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await createCourse(req, res);

        expect(courseModel.findCourseByName).toHaveBeenCalledWith(mockCourseData.courseName);
        expect(courseModel.createCourseDB).toHaveBeenCalledWith(mockCourseData);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tạo khóa học thất bại.' });
    });
});