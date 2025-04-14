const { getConnection, closeConnection } = require('../config/database');
const bcrypt = require('bcrypt');

const updateOtp = async (userId, otp, expire) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'UPDATE users SET userOtp = ?, userOtpExpire = ? WHERE userId = ?';
        const [result] = await connection.query(query, [otp, expire, userId]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updatePassword = async (userId, newPassword) => {
    let connection;
    try {
        connection = await getConnection();
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const query = 'UPDATE users SET userPassword = ?, userOtp = NULL, userOtpExpire = NULL WHERE userId = ?';
        const [result] = await connection.query(query, [hashedPassword, userId]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

module.exports = {
    updateOtp,
    updatePassword
}
