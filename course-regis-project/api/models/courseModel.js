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
        c.courseEndDate, c.courseMaxStudent, c.coursePrice, c.courseStatus, c.courseCreatedAt, c.courseUpdatedAt, c.userId, u.userFullName 
        FROM courses c LEFT JOIN users AS u ON u.userId = c.userId LEFT JOIN courseCategories AS cct ON cct.courseCategoryId = c.courseCategoryId 
        WHERE c.courseId = ?`;
        const [rows] = await connection.query(query, [courseId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCourseByIdAndStudentId = async (courseId, studentId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT c.courseId, c.courseCategoryId, cct.courseCategoryName, c.courseName, c.courseDescription, c.courseStartDate,
        c.courseEndDate, c.courseMaxStudent, c.coursePrice, c.courseStatus, c.courseCreatedAt, c.courseUpdatedAt, c.userId, u.userFullName, 
        e1.enrollmentStatus, (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = c.courseId AND e.enrollmentStatus IN ('Enrolled', 'Completed')) 
        AS totalEnrollments, e1.userId AS studentId FROM courses AS c LEFT JOIN users AS u ON u.userId = c.userId LEFT JOIN courseCategories AS cct ON 
        cct.courseCategoryId = c.courseCategoryId LEFT JOIN enrollments e1 ON e1.courseId = c.courseId WHERE c.courseId = ? AND e1.userId = ?`;
        const [rows] = await connection.query(query, [courseId, studentId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCourses = async () => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT c.courseId, c.courseCategoryId,  c.userId, c.courseName, c.courseStartDate, c.courseEndDate, c.coursePrice, c.courseStatus, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = c.courseId AND e.enrollmentStatus IN ('Enrolled', 'Completed')) 
        AS totalEnrollments, u.userFullName, c.courseMaxStudent, e1.userId AS studentId, e1.enrollmentStatus FROM courses AS c 
        LEFT JOIN users u ON c.userId = u.userId LEFT JOIN enrollments e1 ON e1.courseId = c.courseId`;
        const [rows] = await connection.query(query);
        return rows.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updateCourseDB = async(courseId, courseData) => {
    let connection;
    try {
        connection = await getConnection();
        const { userId, courseCategoryId, courseName, courseDescription, courseStartDate, courseEndDate, courseMaxStudent, coursePrice, courseStatus, } = courseData;
        const query = `UPDATE courses SET  userId = ?, courseCategoryId = ?, courseName = ?, courseDescription = ?, courseStartDate = ?,
        courseEndDate = ?, courseMaxStudent = ?, coursePrice = ?, courseStatus = ? WHERE courseId = ?`;
        const values = [userId, courseCategoryId, courseName, courseDescription, courseStartDate, courseEndDate, courseMaxStudent, coursePrice, courseStatus, courseId];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const deleteCourseDB = async(courseId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = `DELETE FROM courses WHERE courseId = ?`;
        const [result] = await connection.query(query, [courseId]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const createEnrollment = async (studentId, courseId) => {
    let connection;
    try {
        connection = await getConnection();
        const enrollmentId = nanoid(20);
        const query = 'INSERT INTO enrollments (enrollmentId, userId, courseId, enrollmentStatus) VALUES (?, ?, ?, ?)';
        const values = [enrollmentId, studentId, courseId, 'Enrolled'];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updateEnrollmentStatus = async (studentId, courseId, status) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'UPDATE enrollments SET enrollmentStatus = ? WHERE userId = ? AND courseId = ?';
        const values = [status, studentId, courseId];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findStudentsByCourseId = async (courseId) => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT u.userId, u.userFullName, u.userEmail, u.userGender, u.userPhoneNumber, u.userAddress 
        FROM users u JOIN enrollments e ON u.userId = e.userId WHERE e.courseId = ?`;
        const [rows] = await connection.query(query, [courseId]);
        return rows.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCourseCategoryByName = async (courseCategoryName) => {
    let connection;
    try {
        connection = await getConnection();
        const query = 'SELECT * FROM courseCategories WHERE courseCategoryName = ?';
        const [rows] = await connection.query(query, [courseCategoryName]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const createCourseCategoryDB = async (courseCategoryName) => {
    let connection;
    try {
        connection = await getConnection();
        const courseCategoryId = nanoid(20);
        const query = `INSERT INTO courseCategories (courseCategoryId, courseCategoryName) VALUES (?, ?)`;
        const values = [courseCategoryId, courseCategoryName];
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCourseCategories = async () => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT * FROM courseCategories`;
        const [rows] = await connection.query(query);
        return rows.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const findCoursesWithinDays = async () => {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT c.courseId, c.courseName, c.courseStartDate, DATEDIFF(c.courseStartDate, CURRENT_DATE) AS daysUntilStart, c.courseStatus, 
        c.userId, e1.userId AS studentId FROM courses c LEFT JOIN enrollments e1 ON e1.courseId = c.courseId WHERE c.courseStartDate >= CURRENT_DATE AND 
        DATEDIFF(c.courseStartDate, CURRENT_DATE) <= 3 ORDER BY daysUntilStart ASC`;
        const [rows] = await connection.query(query);
        return rows.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    } finally {
        await closeConnection(connection);
    }
};

const updateEnrollmentStatusCompleted = async () => {
  let connection;
  try {
    connection = await getConnection();
    const querySelect = `SELECT e.enrollmentId, c.courseEndDate FROM enrollments e JOIN courses c ON e.courseId = c.courseId WHERE e.enrollmentStatus = 'Enrolled'`;
    const [rows] = await connection.query(querySelect);
    if (!rows.length) {
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const toUpdate = rows
      .filter(row => {
        const courseEndDate = new Date(row.courseEndDate);
        courseEndDate.setHours(0, 0, 0, 0);
        return courseEndDate < today;
      })
      .map(row => row.enrollmentId);
    if (toUpdate.length === 0) {
      return;
    }
    const queryUpdate = `UPDATE enrollments SET enrollmentStatus = 'Completed' WHERE enrollmentId IN (?)`;
    await connection.query(queryUpdate, [toUpdate]);
  } catch (error) {
    throw error;
  } finally {
    await closeConnection(connection);
  }
};

module.exports = {
    createCourseDB,
    findCourseByName,
    findCourseById,
    findCourses,
    updateCourseDB,
    deleteCourseDB,
    createEnrollment,
    updateEnrollmentStatus,
    findStudentsByCourseId,
    findCourseCategoryByName,
    createCourseCategoryDB,
    findCourseCategories,
    findCourseByIdAndStudentId,
    findCoursesWithinDays,
    updateEnrollmentStatusCompleted
};
