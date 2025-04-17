const { getConnection, closeConnection } = require('../config/database');
const nanoid = require('nanoid').nanoid;
const bcrypt = require('bcrypt');

const createUser = async(userData) => {
    let connection;
    try {
        connection = await getConnection();
        const userId = nanoid(20);
        const { userFullName, userEmail, userPassword, userGender, userPhoneNumber, userAddress, userRole, userStatus } = userData;
        const hashedPassword = bcrypt.hashSync(userPassword, 10);
        const query = 'INSERT INTO users (userId, userFullName, userEmail, userPassword, userGender, userPhoneNumber, userAddress, userRole, userStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [userId, userFullName, userEmail, hashedPassword, userGender, userPhoneNumber, userAddress, userRole || 'Student', userStatus || 'Active'];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findUserByEmail = async(email) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT * FROM users WHERE userEmail = ?';
        const [rows] = await connection.query(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findUserById = async(userId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT * FROM users WHERE userId = ?';
        const [rows] = await connection.query(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const createUserWithGoogle = async(userData) => {
    let connection;
    try {
        connection = await getConnection();
        const userId = nanoid(20);
        const { googleId, userFullName, userEmail, userRole, userStatus } = userData;
        const hashedPassword = bcrypt.hashSync(nanoid(6), 10);
        const query = 'INSERT INTO users (userId, googleId, userFullName, userEmail, userPassword, userRole, userStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [userId, googleId, userFullName, userEmail, hashedPassword, userRole || 'Student', userStatus || 'Active'];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updateGoogleId = async (userId, googleId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'UPDATE users SET googleId = ? WHERE userId = ?';
        const [result] = await connection.query(query, [googleId, userId]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updateUserDB = async(userId, userData) => {
    let connection;
    try {
        connection = await getConnection();
        const { userFullName, userEmail, userPassword, userGender, userPhoneNumber, userAddress, userRole, userStatus } = userData;
        const query = 'UPDATE users SET userFullName = ?, userEmail = ?, userPassword = ?, userGender = ?, userPhoneNumber = ?, userAddress = ?, userRole = ?, userStatus = ? WHERE userId = ?';
        const values = [userFullName, userEmail, userPassword, userGender, userPhoneNumber, userAddress, userRole || 'Student', userStatus || 'Active', userId];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    createUserWithGoogle,
    updateGoogleId,
    findUserById,
    updateUserDB
}