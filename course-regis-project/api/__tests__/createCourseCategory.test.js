const {
  createCourseCategory,
} = require('../controllers/courseController');

const courseModel = require('../models/courseModel');

jest.mock('../models/courseModel');

describe('Unit test cho createCourseCategory', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: { courseCategoryName: 'Frontend' },
      session: { user: { userRole: 'Admin' } },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('Tạo danh mục thành công với Admin', async () => {
    courseModel.findCourseCategoryByName.mockResolvedValue(null);
    courseModel.createCourseCategoryDB.mockResolvedValue();

    await createCourseCategory(req, res);

    expect(courseModel.findCourseCategoryByName).toHaveBeenCalledWith('Frontend');
    expect(courseModel.createCourseCategoryDB).toHaveBeenCalledWith('Frontend');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tạo danh mục khóa học thành công.',
      courseCategoryName: 'Frontend',
    });
  });

  it('Tạo danh mục bị từ chối nếu chưa đăng nhập', async () => {
    req.session.user = null;

    await createCourseCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Cần đăng nhập để có quyền truy cập.',
    });
  });

  it('Tạo danh mục bị từ chối nếu không phải Admin hoặc Instructor', async () => {
    req.session.user.userRole = 'Student';

    await createCourseCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tài khoản này không có quyền truy cập.',
    });
  });

  it('Trả về lỗi nếu tên danh mục đã tồn tại', async () => {
    courseModel.findCourseCategoryByName.mockResolvedValue({ id: '123', name: 'Frontend' });

    await createCourseCategory(req, res);

    expect(courseModel.findCourseCategoryByName).toHaveBeenCalledWith('Frontend');
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tên danh mục khóa học đã tồn tại.',
    });
  });

  it('Trả về lỗi server nếu có exception', async () => {
    courseModel.findCourseCategoryByName.mockRejectedValue(new Error('DB lỗi'));

    await createCourseCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tạo danh mục khóa học thất bại.',
    });
  });
});
