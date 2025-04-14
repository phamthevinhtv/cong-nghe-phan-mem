const { login } = require('../controllers/authController');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

jest.mock('../models/userModel');
jest.mock('bcrypt');

describe('Kiểm thử chức năng đăng nhập', () => {
    const mockUserData = {
        userId: 'aGj0Hm_F2eOpqfGq5xj3',
        userFullName: 'Nguyễn Văn A',
        userEmail: 'example@fake.com',
        userPassword: '$2b$10$oCUAJBj9IkvaC6J1cYtaXeCUcprhlhQau6w7KenS26dqwgiaeyhOW',
        userRole: 'Student'
    };

    const reqBody = {
        userEmail: 'example@fake.com',
        userPassword: '12345678'
    };

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: reqBody,
            session: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải đăng nhập thành công khi email và mật khẩu đúng', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUserData);
        bcrypt.compare.mockResolvedValue(true);

        await login(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(reqBody.userEmail);
        expect(bcrypt.compare).toHaveBeenCalledWith(reqBody.userPassword, mockUserData.userPassword);
        expect(req.session.user).toEqual({
            userId: mockUserData.userId,
            userEmail: mockUserData.userEmail,
            userFullName: mockUserData.userFullName,
            userRole: mockUserData.userRole
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đăng nhập thành công.',
            user: req.session.user
        });
    });

    it('Phải trả về lỗi khi email không tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);

        await login(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(reqBody.userEmail);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email không tồn tại.' });
    });

    it('Phải trả về lỗi khi mật khẩu sai', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUserData);
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(reqBody.userEmail);
        expect(bcrypt.compare).toHaveBeenCalledWith(reqBody.userPassword, mockUserData.userPassword);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Sai mật khẩu.' });
    });

    it('Phải trả về lỗi khi xảy ra exception', async () => {
        userModel.findUserByEmail.mockRejectedValue(new Error('Lỗi database'));

        await login(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(reqBody.userEmail);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng nhập thất bại.' });
    });
});
