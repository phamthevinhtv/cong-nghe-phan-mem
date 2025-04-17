const { googleLoginInit, googleLoginCallback } = require('../controllers/authController');
const { OAuth2Client } = require('google-auth-library');
const {
    findUserByEmail,
    updateGoogleId,
    createUserWithGoogle
} = require('../models/userModel');
const sendEmail = require('../utils/sendMail');

jest.mock('google-auth-library', () => {
    const mClient = {
        generateAuthUrl: jest.fn(),
        getToken: jest.fn(),
        setCredentials: jest.fn(),
        verifyIdToken: jest.fn(),
    };
    return { OAuth2Client: jest.fn(() => mClient) };
});

jest.mock('../models/userModel');
jest.mock('../utils/sendMail');

describe('Google OAuth2', () => {
    let req, res, mockClient;

    beforeEach(() => {
        req = { session: {}, query: { code: 'fake-code' } };
        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockClient = new OAuth2Client();
        jest.clearAllMocks();
    });

    describe('googleLoginInit', () => {
        it('Phải redirect đến Google Auth URL', () => {
            mockClient.generateAuthUrl.mockReturnValue('https://fake-auth-url.com');

            googleLoginInit(req, res);

            expect(mockClient.generateAuthUrl).toHaveBeenCalledWith({
                access_type: 'offline',
                scope: ['profile', 'email'],
                redirect_uri: process.env.GOOGLE_REDIRECT_URI
            });
            expect(res.redirect).toHaveBeenCalledWith('https://fake-auth-url.com');
        });
    });

    describe('googleLoginCallback', () => {
        const fakeTokens = { id_token: 'fake-id-token' };
        const fakePayload = {
            email: 'example@fake.com',
            sub: 'google-id-123',
            name: 'Nguyễn Văn A'
        };
        const fakeTicket = {
            getPayload: () => fakePayload
        };

        it('Đăng nhập thành công nếu tài khoản đã liên kết Google', async () => {
            mockClient.getToken.mockResolvedValue({ tokens: fakeTokens });
            mockClient.verifyIdToken.mockResolvedValue(fakeTicket);

            const existingUser = {
                userId: 1,
                userEmail: fakePayload.email,
                userFullName: fakePayload.name,
                userRole: 'Student',
                googleId: 'google-id-123'
            };

            findUserByEmail.mockResolvedValue(existingUser);

            await googleLoginCallback(req, res);

            expect(mockClient.getToken).toHaveBeenCalledWith('fake-code');
            expect(findUserByEmail).toHaveBeenCalledWith(fakePayload.email);
            expect(req.session.user).toEqual({
                userId: 1,
                userEmail: fakePayload.email,
                userFullName: fakePayload.name,
                userRole: 'Student'
            });
            expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/home');
        });

        it('Liên kết Google ID nếu user tồn tại nhưng chưa liên kết', async () => {
            mockClient.getToken.mockResolvedValue({ tokens: fakeTokens });
            mockClient.verifyIdToken.mockResolvedValue(fakeTicket);

            const userWithoutGoogleId = {
                userId: 2,
                userEmail: fakePayload.email,
                userFullName: fakePayload.name,
                userRole: 'Student',
                googleId: null
            };

            findUserByEmail.mockResolvedValue(userWithoutGoogleId);

            await googleLoginCallback(req, res);

            expect(updateGoogleId).toHaveBeenCalledWith(2, fakePayload.sub);
            expect(sendEmail).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/home');
        });

        it('Tạo user mới nếu chưa tồn tại', async () => {
            mockClient.getToken.mockResolvedValue({ tokens: fakeTokens });
            mockClient.verifyIdToken.mockResolvedValue(fakeTicket);

            findUserByEmail
                .mockResolvedValueOnce(null) 
                .mockResolvedValueOnce({   
                    userId: 3,
                    userEmail: fakePayload.email,
                    userFullName: fakePayload.name,
                    userRole: 'Student'
                });

            await googleLoginCallback(req, res);

            expect(createUserWithGoogle).toHaveBeenCalledWith(expect.objectContaining({
                userEmail: fakePayload.email,
                googleId: fakePayload.sub
            }));
            expect(sendEmail).toHaveBeenCalled();
            expect(req.session.user).toEqual(expect.objectContaining({
                userId: 3,
                userEmail: fakePayload.email
            }));
            expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/home');
        });

        it('Trả về lỗi nếu xác thực thất bại', async () => {
            mockClient.getToken.mockRejectedValue(new Error('Google Auth Error'));

            await googleLoginCallback(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lỗi xác thực Google.' });
        });
    });
});