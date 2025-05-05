const { getConnection, closeConnection } = require('../config/database');
const nanoid = require('nanoid').nanoid;

const createCourseDB = async (courseData) => {
    let connection;
    try {
        connection = await getConnection();
        const courseId = nanoid(20);
        const { userId, courseCategoryId, courseName, courseDescription, courseStartDate, courseEndDate, courseMaxStudent, coursePrice, courseStatus } = courseData;
        const query = `INSERT INTO courses (courseId, userId, courseCategoryId, courseName, courseDescription, courseStartDate, courseEndDate, courseMaxStudent, coursePrice, courseStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [courseId, userId, courseCategoryId, courseName, courseDescription, courseStartDate, courseEndDate, courseMaxStudent, coursePrice, courseStatus || 'Draft'];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCourseByName = async (courseName) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT * FROM courses WHERE courseName = ?';
        const [rows] = await connection.query(query, [courseName]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

module.exports = {
    createCourseDB,
    findCourseByName
};

