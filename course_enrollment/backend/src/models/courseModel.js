const getCourseEnrollmentInfo = async (courseId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(*) AS currentStudent FROM enrollments WHERE courseId = ?",
      [courseId],
      (err, results) => {
        if (err) return reject(err);
        const currentStudent = results[0].currentStudent;
        connection.query(
          "SELECT courseMaxStudent FROM courses WHERE courseId = ?",
          [courseId],
          (err2, results2) => {
            if (err2) return reject(err2);
            const courseMaxStudent = results2[0]?.courseMaxStudent || null;
            resolve({ currentStudent, courseMaxStudent });
          }
        );
      }
    );
  });
};
const connection = require("../config/database");

const updateCourse = async (courseId, updateData, userId, role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM courses WHERE courseId = ?",
      [courseId],
      (err, results) => {
        if (err) return reject(err);
        const course = results[0];
        if (!course) return resolve(null);
        if (role === "Teacher" && course.userId !== userId)
          return resolve(null);
        const fields = [];
        const values = [];
        for (const key in updateData) {
          if (updateData[key] !== undefined && key !== "courseId") {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
          }
        }
        if (fields.length === 0) return resolve(course);
        values.push(courseId);
        const sql = `UPDATE courses SET ${fields.join(
          ", "
        )} WHERE courseId = ?`;
        connection.query(sql, values, (err2, result) => {
          if (err2) return reject(err2);
          connection.query(
            "SELECT * FROM courses WHERE courseId = ?",
            [courseId],
            (err3, results2) => {
              if (err3) return reject(err3);
              resolve(results2[0]);
            }
          );
        });
      }
    );
  });
};

const canDeleteCourse = async (courseId, userId, role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(*) AS count FROM enrollments WHERE courseId = ?",
      [courseId],
      (err, results) => {
        if (err) return reject(err);
        if (results[0].count > 0) return resolve(false);
        connection.query(
          "SELECT * FROM courses WHERE courseId = ?",
          [courseId],
          (err2, courseResults) => {
            if (err2) return reject(err2);
            const course = courseResults[0];
            if (!course) return resolve(false);
            if (role === "Admin") return resolve(true);
            if (role === "Teacher" && course.userId === userId)
              return resolve(true);
            return resolve(false);
          }
        );
      }
    );
  });
};

const deleteCourse = async (courseId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM courses WHERE courseId = ?",
      [courseId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const findCourseByName = async (courseName) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM courses WHERE courseName = ?",
      [courseName],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const createCategory = async (category) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO courseCategories (courseCategoryId, courseCategoryName) VALUES (?, ?)";
    connection.query(
      sql,
      [category.courseCategoryId, category.courseCategoryName],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const findCategoryByName = async (categoryName) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM courseCategories WHERE courseCategoryName = ?",
      [categoryName],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const createCourse = async (course) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO courses (courseId, userId, courseCategoryId, courseName, courseImage, courseDescription, courseDate, courseDuration, courseLocation, coursePlatform, courseMaxStudent, coursePrice, courseStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sql,
      [
        course.courseId,
        course.userId,
        course.courseCategoryId,
        course.courseName,
        course.courseImage,
        course.courseDescription,
        course.courseDate,
        course.courseDuration,
        course.courseLocation,
        course.coursePlatform,
        course.courseMaxStudent,
        course.coursePrice,
        course.courseStatus,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getAllCategories = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM courseCategories", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getAllCourses = async (role, userId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT c.*, u.userFullName AS teacherName, (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = c.courseId) AS currentStudent FROM courses c LEFT JOIN users u ON c.userId = u.userId`;
    let params = [];
    if (role === "Teacher") {
      sql += " WHERE c.userId = ?";
      params = [userId];
    } else if (role === "Admin") {
    } else {
      sql += " WHERE c.courseStatus = ? AND c.userId IS NOT NULL";
      params = ["Publish"];
    }
    connection.query(sql, params, async (err, results) => {
      if (err) return reject(err);
      // Đảm bảo courseDate trả về đúng dạng 'YYYY-MM-DD'
      const normalizeDate = (date) => {
        if (!date) return null;
        if (typeof date === "string" && date.length >= 10)
          return date.slice(0, 10);
        if (date instanceof Date) {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        }
        return String(date);
      };
      let filtered = results.map((course) => ({
        ...course,
        courseDate: normalizeDate(course.courseDate),
        currentStudent: course.currentStudent || 0,
      }));
      if (role === "Guest" || role === "Student") {
        const now = new Date();
        let enrolledIds = [];
        if (role === "Student" && userId) {
          enrolledIds = await new Promise((resolveEnroll, rejectEnroll) => {
            connection.query(
              "SELECT courseId FROM enrollments WHERE userId = ?",
              [userId],
              (errEnroll, enrollResults) => {
                if (errEnroll) return rejectEnroll(errEnroll);
                resolveEnroll(enrollResults.map((e) => e.courseId));
              }
            );
          });
        }
        filtered = filtered
          .filter((course) => {
            const courseDate = course.courseDate;
            const courseDuration = course.courseDuration;
            const startDate = formatDateTime(courseDate, courseDuration);
            if (role === "Guest") {
              return startDate && startDate > now;
            } else if (role === "Student") {
              return (
                (startDate && startDate > now) ||
                enrolledIds.includes(course.courseId)
              );
            }
            return true;
          })
          .map((course) => ({
            ...course,
            isEnrolled:
              role === "Student" && enrolledIds.includes(course.courseId),
          }));
      }
      resolve(filtered);
    });
  });
};

const formatDateTime = (dateStr, durationStr) => {
  if (!dateStr || !durationStr) return null;
  const startTime = durationStr.split(" - ")[0];
  let dateStrFormatted = dateStr;
  if (dateStr instanceof Date) {
    const yyyy = dateStr.getFullYear();
    const mm = String(dateStr.getMonth() + 1).padStart(2, "0");
    const dd = String(dateStr.getDate()).padStart(2, "0");
    dateStrFormatted = `${yyyy}-${mm}-${dd}`;
  }
  if (typeof dateStrFormatted === "number") {
    dateStrFormatted = new Date(dateStrFormatted).toISOString().slice(0, 10);
  }
  const [yyyy, mm, dd] = dateStrFormatted.split("-");
  return new Date(`${yyyy}-${mm}-${dd}T${startTime}:00`);
};

const getCourseById = async (courseId, role, userId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT c.*, u.userFullName AS teacherName, (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = c.courseId) AS currentStudent FROM courses c LEFT JOIN users u ON c.userId = u.userId WHERE c.courseId = ?`;
    let params = [courseId];
    connection.query(sql, params, async (err, results) => {
      if (err) return reject(err);
      let course = results[0];
      if (!course) return resolve(null);
      // Đảm bảo courseDate trả về đúng dạng 'YYYY-MM-DD'
      const normalizeDate = (date) => {
        if (!date) return null;
        if (typeof date === "string" && date.length >= 10)
          return date.slice(0, 10);
        if (date instanceof Date) {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        }
        return String(date);
      };
      course.courseDate = normalizeDate(course.courseDate);
      course.currentStudent = course.currentStudent || 0;
      const now = new Date();
      if (role === "Admin") return resolve({ ...course, isEnrolled: false });
      if (role === "Teacher") {
        if (course.userId === userId) {
          return resolve({ ...course, isEnrolled: false });
        }
        return resolve(null);
      }
      if (role === "Guest") {
        const startDate = formatDateTime(
          course.courseDate,
          course.courseDuration
        );
        if (course.courseStatus === "Publish" && startDate && startDate > now)
          return resolve({ ...course, isEnrolled: false });
        return resolve(null);
      }
      if (role === "Student") {
        const startDate = formatDateTime(
          course.courseDate,
          course.courseDuration
        );
        let enrolled = false;
        if (userId) {
          enrolled = await new Promise((resolveEnroll, rejectEnroll) => {
            connection.query(
              "SELECT * FROM enrollments WHERE userId = ? AND courseId = ?",
              [userId, courseId],
              (errEnroll, enrollResults) => {
                if (errEnroll) return rejectEnroll(errEnroll);
                resolveEnroll(enrollResults.length > 0);
              }
            );
          });
        }
        if (
          (course.courseStatus === "Publish" && startDate && startDate > now) ||
          enrolled
        )
          return resolve({ ...course, isEnrolled: enrolled });
        return resolve(null);
      }
      return resolve(null);
    });
  });
};

const enrollCourse = async (studentId, courseId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO enrollments (userId, courseId) VALUES (?, ?)";
    connection.query(sql, [studentId, courseId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const unenrollCourse = async (studentId, courseId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM enrollments WHERE userId = ? AND courseId = ?";
    connection.query(sql, [studentId, courseId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const isEnrolled = async (studentId, courseId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM enrollments WHERE userId = ? AND courseId = ?";
    connection.query(sql, [studentId, courseId], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};

const getEnrolledStudents = async (courseId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.userFullName, u.userEmail, u.userPhoneNumber FROM enrollments e JOIN users u ON e.userId = u.userId WHERE e.courseId = ?`;
    connection.query(sql, [courseId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  createCategory,
  findCategoryByName,
  createCourse,
  getAllCategories,
  getAllCourses,
  getCourseById,
  enrollCourse,
  unenrollCourse,
  isEnrolled,
  findCourseByName,
  formatDateTime,
  canDeleteCourse,
  deleteCourse,
  updateCourse,
  getEnrolledStudents,
  getCourseEnrollmentInfo,
};
