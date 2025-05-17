const { getCourseCategories } = require('../controllers/courseController');
const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Unit test cho getCourseCategories', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      session: { user: { userRole: 'Instructor' } },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('Lấy danh sách danh mục thành công', async () => {
    const mockCategories = [{ id: 1, name: 'Backend' }, { id: 2, name: 'Frontend' }];
    courseModel.findCourseCategories.mockResolvedValue(mockCategories);

    await getCourseCategories(req, res);

    expect(courseModel.findCourseCategories).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ courseCategories: mockCategories });
  });

  it('Trả về lỗi nếu chưa đăng nhập', async () => {
    req.session.user = null;

    await getCourseCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Cần đăng nhập để có quyền truy cập.',
    });
  });

  it('Trả về lỗi nếu user không phải Admin hoặc Instructor', async () => {
    req.session.user.userRole = 'Student';

    await getCourseCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tài khoản này không có quyền truy cập.',
    });
  });

  it('Trả về lỗi nếu không có danh mục nào', async () => {
    courseModel.findCourseCategories.mockResolvedValue([]);

    await getCourseCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Danh mục khóa học không tồn tại.',
    });
  });

  it('Trả về lỗi server nếu findCourseCategories thất bại', async () => {
    courseModel.findCourseCategories.mockRejectedValue(new Error('Lỗi DB'));

    await getCourseCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tìm danh mục khóa học thất bại.',
    });
  });
});
