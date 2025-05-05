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

const findCourseById = async (courseId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT c.courseId, c.courseCategoryId, cct.courseCategoryName, c.courseName, c.courseDescription, c.courseStartDate,
        c.courseEndDate, c.courseMaxStudent, c.coursePrice, c.courseStatus, c.courseCreatedAt, c.courseUpdatedAt, c.userId, u.userFullName, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = c.courseId AND e.enrollmentStatus IN ('Enrolled', 'Completed')) 
        AS totalEnrollments, e1.userId AS studentId FROM courses AS c JOIN users AS u ON u.userId = c.userId LEFT JOIN courseCategories AS cct ON 
        cct.courseCategoryId = c.courseCategoryId LEFT JOIN enrollments e1 ON e1.courseId = c.courseId WHERE c.courseId = ?`;
        const [rows] = await connection.query(query, [courseId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

module.exports = {
    createCourseDB,
    findCourseByName,
    findCourseById
};

