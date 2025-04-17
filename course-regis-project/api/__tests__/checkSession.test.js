const { checkSession } = require('../controllers/authController');

describe('Kiểm thử chức năng checkSession', () => {
    it('Phải trả về thông tin người dùng khi đã đăng nhập', async () => {
        const req = { session: { user: { userId: 'aGj0Hm_F2eOpqfGq5xj3', userEmail: 'example@fake.com' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

        await checkSession(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ loggedIn: true, user: req.session.user });
    });

    it('Phải trả về loggedIn: false nếu không có người dùng trong session', async () => {
        const req = { session: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

        await checkSession(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ loggedIn: false });
    });
});
