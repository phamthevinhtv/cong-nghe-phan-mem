const { resetPassword } = require('../controllers/authController');
const userModel = require('../models/userModel');
const authModel = require('../models/authModel');
const sendMail = require('../utils/sendMail');

jest.mock('../models/userModel');
jest.mock('../models/authModel');
jest.mock('../utils/sendMail');

describe('Kiểm thử chức năng đặt lại mật khẩu', () => {
    const mockUser = {
        userId: 'aGj0Hm_F2eOpqfGq5xj3',
        userFullName: 'Nguyễn Văn A',
        userEmail: 'example@fake.com',
        userPassword: '$2b$10$oCUAJBj9IkvaC6J1cYtaXeCUcprhlhQau6w7KenS26dqwgiaeyhOW',
        userRole: 'Student',
        userOtp: 'nQGH1y',
        userOtpExpire: new Date(Date.now() + 10 * 60 * 1000),
    };

    const req = {
        body: {
            userEmail: mockUser.userEmail,
            userOtp: mockUser.userOtp,
            userPassword: '123456',
        },
    };

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    it('Đổi mật khẩu thành công khi đúng OTP và còn hạn', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updatePassword.mockResolvedValue();
        sendMail.mockResolvedValue();

        await resetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(req.body.userEmail);
        expect(authModel.updatePassword).toHaveBeenCalledWith(
            mockUser.userId,
            req.body.userPassword
        );
        expect(sendMail).toHaveBeenCalledWith(
            mockUser.userEmail,
            'Đổi mật khẩu thành công',
            expect.stringContaining('Mật khẩu của bạn đã được đổi thành công')
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đổi mật khẩu thành công.'
        });
    });

    it('Trả lỗi nếu email không tồn tại', async () => {
        userModel.findUserByEmail.mockResolvedValue(null);

        await resetPassword(req, res);

        expect(userModel.findUserByEmail).toHaveBeenCalledWith(req.body.userEmail);
        expect(authModel.updatePassword).not.toHaveBeenCalled();
        expect(sendMail).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Email không tồn tại.'
        });
    });

    it('Trả lỗi nếu OTP sai', async () => {
        const invalidOtpUser = { ...mockUser, userOtp: 'abcdef' };
        userModel.findUserByEmail.mockResolvedValue(invalidOtpUser);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Mã OTP không hợp lệ hoặc đã hết hạn.'
        });
    });

    it('Trả lỗi nếu OTP đã hết hạn', async () => {
        const expiredUser = {
            ...mockUser,
            userOtpExpire: new Date(Date.now() - 10 * 60 * 1000),
        };
        userModel.findUserByEmail.mockResolvedValue(expiredUser);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Mã OTP không hợp lệ hoặc đã hết hạn.'
        });
    });

    it('Trả lỗi nếu update mật khẩu thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updatePassword.mockRejectedValue(new Error('DB error'));

        await resetPassword(req, res);

        expect(authModel.updatePassword).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đổi mật khẩu thất bại.'
        });
    });

    it('Trả lỗi nếu gửi email thất bại', async () => {
        userModel.findUserByEmail.mockResolvedValue(mockUser);
        authModel.updatePassword.mockResolvedValue();
        sendMail.mockRejectedValue(new Error('Mail error'));

        await resetPassword(req, res);

        expect(sendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Đổi mật khẩu thất bại.'
        });
    });
});
