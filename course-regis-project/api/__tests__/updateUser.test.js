const { updateUser } = require('../controllers/userController');
const { findUserById, updateUserDB } = require('../models/userModel');
const bcrypt = require('bcrypt');

jest.mock('../models/userModel');
jest.mock('bcrypt');

describe('Kiểm thử chức năng updateUser', () => {
    const mockUser = {
        userId: 'u123',
        userFullName: 'Nguyễn Văn A',
        userEmail: 'test@email.com',
        userPassword: '$hashed_pw',
        userRole: 'Student',
        userStatus: 'Active',
        userGender: 'Male',
        userPhoneNumber: '0123456789',
        userAddress: 'TP.HCM'
    };

    let req, res;

    beforeEach(() => {
        req = {
            params: { userId: 'u123' },
            body: {},
            session: { user: { ...mockUser } }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('Phải trả về lỗi 401 nếu chưa đăng nhập', async () => {
        req.session = {};
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cần đăng nhập để có quyền truy cập.' });
    });

    it('Phải trả về lỗi 403 nếu người dùng không phải chủ tài khoản và không phải Admin', async () => {
        req.session.user.userId = 'khac_id';
        req.session.user.userRole = 'Student';
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản này có quyền truy cập.' });
    });

    it('Phải trả về lỗi 404 nếu không tìm thấy người dùng', async () => {
        findUserById.mockResolvedValue(null);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản không tồn tại.' });
    });

    it('Phải trả về lỗi 400 nếu không có thay đổi nào', async () => {
        req.body = { userFullName: 'Nguyễn Văn A' }; // giống dữ liệu cũ
        findUserById.mockResolvedValue(mockUser);
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Không có thay đổi để cập nhật.' });
    });

    it('Phải cập nhật thành công khi có thay đổi hợp lệ', async () => {
        req.body = { userFullName: 'Nguyễn Văn B', userPassword: 'newpassword' };
        findUserById.mockResolvedValue(mockUser);
        bcrypt.compareSync.mockReturnValue(false); // khác mật khẩu
        bcrypt.hashSync.mockReturnValue('$new_hashed_pw');

        await updateUser(req, res);

        expect(updateUserDB).toHaveBeenCalledWith('u123', expect.objectContaining({
            userFullName: 'Nguyễn Văn B',
            userPassword: '$new_hashed_pw'
        }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Cập nhật thành công.',
            user: expect.objectContaining({ userFullName: 'Nguyễn Văn B' })
        });
    });

    it('Phải trả về lỗi 500 nếu có lỗi trong quá trình xử lý', async () => {
        findUserById.mockRejectedValue(new Error('Lỗi DB'));
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật thất bại.' });
    });
});
