const { getCourses } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');
const dayjs = require('dayjs');

jest.mock('../models/courseModel');

describe('Unit test cho getCourses', () => {
    const rawCoursesData = [
        {
            courseId: 'COURSE123',
            courseName: 'Khóa học giao tiếp',
            courseStatus: 'Publish',
            userId: 'USER123',
            courseStartDate: '2025-06-10',
            courseEndDate: '2025-06-20',
            studentId: 'STUDENT999',
        },
        {
            courseId: 'COURSE456',
            courseName: 'Khóa học kỹ năng',
            courseStatus: 'Draft',
            userId: 'USER456',
            courseStartDate: '2025-06-15',
            courseEndDate: '2025-06-30',
            studentId: 'STUDENT999',
        },
        {
            courseId: 'COURSE789',
            courseName: 'Khóa học đã đăng ký',
            courseStatus: 'Draft',
            userId: 'USER999',
            courseStartDate: '2025-05-10',
            courseEndDate: '2025-05-20',
            studentId: 'STUDENT123',
        }
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
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('Trả về tất cả khóa học nếu là Admin', async () => {
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(rawCoursesData) });
    });

    it('Trả về các khóa học của Instructor', async () => {
        req.session.user.userRole = 'Instructor';
        req.session.user.userId = 'USER123';
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        const expectedCourses = rawCoursesData.filter(c => c.userId === 'USER123');

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(expectedCourses) });
    });

    it('Trả về các khóa học được xuất bản và đủ điều kiện cho Student', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'STUDENT999';
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        const currentDate = new Date();
        const expectedCourses = rawCoursesData.filter(course => {
            const courseStart = new Date(course.courseStartDate);
            const threeDaysBeforeStart = new Date(courseStart);
            threeDaysBeforeStart.setDate(courseStart.getDate() - 3);
            return (
                (course.courseStatus === 'Publish' &&
                    course.userId &&
                    currentDate <= threeDaysBeforeStart) ||
                course.studentId === 'STUDENT999'
            );
        });

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(expectedCourses) });
    });

    it('Trả về các khóa học student đã đăng ký (studentId trùng)', async () => {
        req.session.user.userRole = 'Student';
        req.session.user.userId = 'STUDENT123';
        courseModel.findCourses.mockResolvedValue(rawCoursesData);

        const expectedCourses = rawCoursesData.filter(course => {
            const courseStart = new Date(course.courseStartDate);
            const threeDaysBeforeStart = new Date(courseStart);
            threeDaysBeforeStart.setDate(courseStart.getDate() - 3);
            return (
                (course.courseStatus === 'Publish' &&
                    course.userId &&
                    new Date() <= threeDaysBeforeStart) ||
                course.studentId === 'STUDENT123'
            );
        });

        await getCourses(req, res);

        expect(courseModel.findCourses).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ courses: formatDates(expectedCourses) });
    });

    it('Trả về lỗi nếu chưa đăng nhập', async () => {
        req.session.user = null;

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Trả về lỗi nếu user không có quyền truy cập', async () => {
        req.session.user.userRole = 'Guest';

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Trả về lỗi nếu không có khóa học nào', async () => {
        courseModel.findCourses.mockResolvedValue([]);

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Khóa học không tồn tại.' });
    });

    it('Trả về lỗi server nếu xảy ra exception', async () => {
        courseModel.findCourses.mockRejectedValue(new Error('Lỗi DB'));

        await getCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tìm khóa học thất bại.' });
    });
});
