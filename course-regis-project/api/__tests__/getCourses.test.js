const { getCourses } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const dayjs = require('dayjs');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng getCourses', () => {
    const rawCoursesData = [
        {
            courseId: 'COURSE123',
            courseName: 'Khóa học giao tiếp',
            courseStatus: 'Publish',
            userId: 'USER123',
            courseStartDate: '2025-05-01',
            courseEndDate: '2025-05-15',
        },
        {
            courseId: 'COURSE456',
            courseName: 'Khóa học kỹ năng',
            courseStatus: 'Draft',
            userId: 'USER456',
            courseStartDate: '2025-06-01',
            courseEndDate: '2025-06-15',
        },
    ];

    const formatDates = (courses) =>
        courses.map(course => ({
            ...course,
            courseStartDate: dayjs(course.courseStartDate).format('YYYY-MM-DD'),
            courseEndDate: dayjs(course.courseEndDate).format('YYYY-MM-DD'),
        }));

    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {},
            session: { user: { userId: 'USER123', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải trả về danh sách khóa học khi người dùng là Admin', async () => {
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(rawCoursesData) });
    });

    it('Phải trả về danh sách khóa học của Instructor', async () => {
        req.session.user.userRole = 'Instructor';
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        const filtered = rawCoursesData.filter(c => c.userId === 'USER123');

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(filtered) });
    });

    it('Phải trả về danh sách khóa học đã xuất bản cho Student', async () => {
        req.session.user.userRole = 'Student';
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        const filtered = rawCoursesData.filter(c => c.courseStatus === 'Publish');

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(filtered) });
    });

    it('Phải trả về lỗi khi người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Guest';

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi khi không tìm thấy khóa học', async () => {
        courseModel.findCourses.mockResolvedValue([]);

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi khi tìm khóa học thất bại', async () => {
        courseModel.findCourses.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tìm khóa học thất bại.' });
    });
});
