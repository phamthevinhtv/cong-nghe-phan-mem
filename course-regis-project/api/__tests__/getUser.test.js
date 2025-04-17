const { getUser } = require('../controllers/userController');
const userModel = require('../models/userModel');

jest.mock('../models/userModel');

describe('Kiểm thử chức năng getUser', () => {
    const mockUserData = {
        userId: 'aGj0Hm_F2eOpqfGq5xj3',
        userFullName: 'Nguyễn Văn A',
        userEmail: 'example@fake.com',
        userRole: 'Student',
        userStatus: 'Active',
        userGender: 'Male',
        userPhoneNumber: '0987654321',
        userAddress: 'Đà Nẵng'
    };

    const req = { params: { userId: 'aGj0Hm_F2eOpqfGq5xj3' }, session: { user: { userId: 'aGj0Hm_F2eOpqfGq5xj3', userRole: 'Admin' } } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

    it('Phải trả về thông tin người dùng khi tìm thấy người dùng', async () => {
        userModel.findUserById.mockResolvedValue(mockUserData);

        await getUser(req, res);

        expect(userModel.findUserById).toHaveBeenCalledWith('aGj0Hm_F2eOpqfGq5xj3');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ user: mockUserData });
    });

    it('Phải trả về lỗi khi người dùng không tồn tại', async () => {
        userModel.findUserById.mockResolvedValue(null);

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản không tồn tại.' });
    });
});
