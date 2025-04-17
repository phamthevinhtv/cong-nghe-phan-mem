const { requestResetPassword } = require('../controllers/authController');
const userModel = require('../models/userModel');
const authModel = require('../models/authModel');
const sendMail = require('../utils/sendMail');
const { nanoid } = require('nanoid');

jest.mock('../models/userModel');
jest.mock('../models/authModel');
jest.mock('../utils/sendMail');
jest.mock('nanoid', () => ({ nanoid: jest.fn() }));

describe('Kiểm thử chức năng yêu cầu đặt lại mật khẩu', () => {
    const mockUser = {
        userId: 'aGj0Hm_F2eOpqfGq5xj3',
        userFullName: 'Nguyễn Văn A',
        userEmail: 'example@fake.com',
        userPassword: '$2b$10$oCUAJBj9IkvaC6J1cYtaXeCUcprhlhQau6w7KenS26dqwgiaeyhOW',
        userRole: 'Student',
    };

    const req = { body: { userEmail: mockUser.userEmail } };
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Phải gửi OTP khi email tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updateOtp.mockResolvedValue();
        sendMail.mockResolvedValue();
        nanoid.mockReturnValue('nQGH1y');

        await requestResetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUser.userEmail);
        expect(authModel.updateOtp).toHaveBeenCalledWith(
            mockUser.userId,
            'nQGH1y',
            expect.any(Date)
        );
        expect(sendMail).toHaveBeenCalledWith(
            mockUser.userEmail,
            'Mã OTP xác thực đặt lại mật khẩu',
            expect.stringContaining('nQGH1y')
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Mã OTP đã được gửi đến email của bạn.' 
        });
    });

    it('Phải trả về lỗi khi email không tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);

        await requestResetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUser.userEmail);
        expect(authModel.updateOtp).not.toHaveBeenCalled();
        expect(sendMail).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Email không tồn tại.'
        });
    });

    it('Phải trả về lỗi khi update OTP thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updateOtp.mockRejectedValue(new Error('DB error'));

        await requestResetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUser.userEmail);
        expect(authModel.updateOtp).toHaveBeenCalled();
        expect(sendMail).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Yêu cầu đặt lại mật khẩu thất bại.'
        });
    });

    it('Phải trả về lỗi khi gửi email thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updateOtp.mockResolvedValue();
        sendMail.mockRejectedValue(new Error('Send error'));
        nanoid.mockReturnValue('nQGH1y');

        await requestResetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(mockUser.userEmail);
        expect(authModel.updateOtp).toHaveBeenCalled();
        expect(sendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Yêu cầu đặt lại mật khẩu thất bại.'
        });
    });
});
