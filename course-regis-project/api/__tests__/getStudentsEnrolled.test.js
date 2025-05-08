const { getStudentsEnrolled } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Kiểm thử chức năng getStudentsEnrolled', () => {
    let req;
    let res;

    const mockStudents = [
        { userId: 'STU001', userFullName: 'Nguyễn Văn A' },
        { userId: 'STU002', userFullName: 'Trần Thị B' }
    ];

    beforeEach(() => {
        req = {
            params: { courseId: 'COURSE123' },
            session: { user: { userId: 'ADMIN01', userRole: 'Admin' } },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải trả về danh sách học viên khi là Admin', async () => {
        courseModel.findStudentsByCourseId.mockResolvedValue(mockStudents);

        await getStudentsEnrolled(req, res);

        expect(courseModel.findStudentsByCourseId).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
    });

    it('Phải trả về danh sách học viên khi là Instructor', async () => {
        req.session.user.userRole = 'Instructor';
        courseModel.findStudentsByCourseId.mockResolvedValue(mockStudents);

        await getStudentsEnrolled(req, res);

        expect(courseModel.findStudentsByCourseId).toHaveBeenCalledWith('COURSE123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
    });

    it('Phải trả về lỗi 401 nếu chưa đăng nhập', async () => {
        req.session.user = null;

        await getStudentsEnrolled(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi 403 nếu người dùng không có quyền', async () => {
        req.session.user.userRole = 'Student';

        await getStudentsEnrolled(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này không có quyền truy cập.' });
    });

    it('Phải trả về lỗi 404 nếu không có học viên nào', async () => {
        courseModel.findStudentsByCourseId.mockResolvedValue([]);

        await getStudentsEnrolled(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Không tồn tại học viên đăng ký khóa học này.' });
    });

    it('Phải trả về lỗi 500 nếu có lỗi khi tìm học viên', async () => {
        courseModel.findStudentsByCourseId.mockRejectedValue(new Error('DB Error'));

        await getStudentsEnrolled(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tìm học viên thất bại.' });
    });
});
