const { getSoonToStartCourses } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const dayjs = require('dayjs');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng getSoonToStartCourses', () => {
    const rawSoonCourses = [
        {
            courseId: 'COURSE001',
            courseName: 'Lập trình nâng cao',
            courseStartDate: '2025-05-20',
            courseStatus: 'Publish',
            userId: 'INSTRUCTOR001',
            studentId: 'STUDENT001',
        },
        {
            courseId: 'COURSE002',
            courseName: 'Thiết kế web',
            courseStartDate: '2025-05-21',
            courseStatus: 'Draft',
            userId: 'INSTRUCTOR002',
            studentId: 'STUDENT002',
        },
    ];

    const formatCourses = (courses) =>
        courses.map(c => ({
            courseId: c.courseId,
            courseName: c.courseName,
            courseStartDate: dayjs(c.courseStartDate).format('YYYY-MM-DD'),
        }));

    let req;
    let res;

    beforeEach(() => {
        req = {
            session: { user: { userId: 'INSTRUCTOR001', userRole: 'Admin' } }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải trả về danh sách khóa học khi người dùng là Admin', async () => {
        courseModel.findCoursesWithinDays.mockResolvedValue(rawSoonCourses);

        await getSoonToStartCourses(req, res);

        expect(courseModel.findCoursesWithinDays).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatCourses(rawSoonCourses) });
    });

    it('Phải lọc khóa học theo Instructor', async () => {
        req.session.user.userRole = 'Instructor';

        courseModel.findCoursesWithinDays.mockResolvedValue(rawSoonCourses);

        const filtered = rawSoonCourses.filter(c => c.userId === 'INSTRUCTOR001');

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatCourses(filtered) });
    });

    it('Phải lọc khóa học Publish và có studentId cho Student', async () => {
        req.session.user = { userId: 'STUDENT001', userRole: 'Student' };

        courseModel.findCoursesWithinDays.mockResolvedValue(rawSoonCourses);

        const filtered = rawSoonCourses.filter(
            c => c.courseStatus === 'Publish' && c.studentId === 'STUDENT001'
        );

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatCourses(filtered) });
    });

    it('Phải trả về lỗi nếu người dùng chưa đăng nhập', async () => {
        req.session.user = null;

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi nếu người dùng không có quyền truy cập', async () => {
        req.session.user.userRole = 'Guest';

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi nếu không tìm thấy khóa học nào', async () => {
        courseModel.findCoursesWithinDays.mockResolvedValue([]);

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Phải trả về lỗi nếu truy vấn thất bại', async () => {
        courseModel.findCoursesWithinDays.mockRejectedValue(new Error('DB Error'));

        await getSoonToStartCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tìm khóa học thất bại.' });
    });
});
