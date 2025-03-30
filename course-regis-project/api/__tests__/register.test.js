const { register } = require('../controllers/authController');
const userModel = require('../models/userModel');
const sendMail = require('../utils/sendMail');

jest.mock('../models/userModel');
jest.mock('../utils/sendMail');

describe('Kiểm thử chức năng đăng ký tài khoản', () => {
    const mockUserData = {
        userFullName: 'Nguyễn Văn A',
        userEmail: 'example@fake.com',
        userPassword: '12345678',
        userGender: 'Nam',
        userPhoneNumber: '0123456789',
        userAddress: '123, ABC, Phường 5, Tp. Trà Vinh',
    };

    let req;
    let res;
    beforeEach(() => {
        req = { body: mockUserData };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải đăng ký thành công khi email chưa tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);
        userModel.createUser.mockResolvedValue();
        sendMail.mockResolvedValue();

        await register(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUserData.userEmail);
        expect(userModel.createUser).toHaveBeenCalledWith(mockUserData);
        expect(sendMail).toHaveBeenCalledWith(
            mockUserData.userEmail,
            'Đăng ký tài khoản thành công.',
            expect.stringContaining(`Xin chào ${mockUserData.userFullName}`)
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng ký tài khoản thành công.' });
    });

    it('Phải trả về lỗi khi email đã tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue({ userEmail: mockUserData.userEmail });

        await register(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUserData.userEmail);
        expect(userModel.createUser).not.toHaveBeenCalled();
        expect(sendMail).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email đã tồn tại.' });
    });

    it('Phải trả về lỗi khi tạo user thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);
        userModel.createUser.mockRejectedValue(new Error('Lỗi cơ sở dữ liệu'));

        await register(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUserData.userEmail);
        expect(userModel.createUser).toHaveBeenCalledWith(mockUserData);
        expect(sendMail).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đăng ký tài khoản thất bại: Lỗi cơ sở dữ liệu',
        });
    });

    it('Phải trả về lỗi khi gửi email thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);
        userModel.createUser.mockResolvedValue();
        sendMail.mockRejectedValue(new Error('Lỗi gửi email'));

        await register(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUserData.userEmail);
        expect(userModel.createUser).toHaveBeenCalledWith(mockUserData);
        expect(sendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đăng ký tài khoản thất bại: Lỗi gửi email',
        });
    });
});
