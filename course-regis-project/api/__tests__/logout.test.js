const { logout } = require('../controllers/authController');

describe('Kiểm thử chức năng logout', () => {
    it('Phải đăng xuất thành công khi có người dùng trong session', async () => {
        const req = { session: { user: { userId: 'aGj0Hm_F2eOpqfGq5xj3' }, destroy: jest.fn((cb) => cb()) } };
        const res = { 
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis() 
        };

        await logout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng xuất thành công.' });
    });

    it('Phải trả về lỗi khi không thể đăng xuất', async () => {
        const req = { session: { user: { userId: 'aGj0Hm_F2eOpqfGq5xj3' }, destroy: jest.fn((cb) => cb(new Error('Lỗi khi logout'))) } };
        const res = { 
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis() 
        };

        await logout(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Đăng xuất thất bại.' });
    });
});
