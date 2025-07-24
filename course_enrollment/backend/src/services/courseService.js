const {
  updateCourse,
  canDeleteCourse,
  deleteCourse,
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
  getEnrolledStudents,
} = require("../models/courseModel");
const { v4: uuidv4 } = require("uuid");

const updateCourseService = async (courseId, updateData, userId, role) => {
  const result = await updateCourse(courseId, updateData, userId, role);
  if (result === null) {
    throw new Error("Không thể cập nhật khóa học.");
  }
  if (result === "NO_CHANGE") {
    throw new Error("Không có thay đổi nào được cập nhật.");
  }
  return result;
};

const getEnrolledStudentsService = async (courseId, teacherId = null) => {
  if (teacherId) {
    // Kiểm tra khóa học có phải của teacher không
    const course = await getCourseById(courseId, "Teacher", teacherId);
    if (!course || course.userId !== teacherId) {
      return null;
    }
  }
  return await getEnrolledStudents(courseId);
};

const deleteCourseService = async (courseId, userId, role) => {
  const canDelete = await canDeleteCourse(courseId, userId, role);
  if (!canDelete) {
    throw new Error("Không thể xóa khóa học này.");
  }
  await deleteCourse(courseId);
  return { message: "Xóa khóa học thành công." };
};

const createCourseCategory = async (categoryName) => {
  const category = {
    courseCategoryId: uuidv4(),
    courseCategoryName: categoryName,
  };
  await createCategory(category);
  return category;
};

const findCategoryByNameService = async (categoryName) => {
  return await findCategoryByName(categoryName);
};

const createNewCourse = async (courseData, userId) => {
  const existed = await findCourseByName(courseData.courseName);
  if (existed) {
    throw new Error("Tên khóa học đã tồn tại.");
  }
  let status = courseData.courseStatus;
  if (!status || (status !== "Publish" && status !== "Draft")) status = "Draft";
  const course = {
    courseId: uuidv4(),
    userId,
    courseCategoryId: courseData.courseCategoryId,
    courseName: courseData.courseName,
    courseImage: courseData.courseImage || null,
    courseDescription: courseData.courseDescription || "",
    courseDate: courseData.courseDate || null,
    courseDuration: courseData.courseDuration || null,
    courseLocation: courseData.courseLocation || null,
    coursePlatform: courseData.coursePlatform || null,
    courseMaxStudent: courseData.courseMaxStudent || null,
    coursePrice: courseData.coursePrice || 0,
    courseStatus: status,
  };
  await createCourse(course);
  return course;
};

const getAllCourseCategories = async () => {
  return await getAllCategories();
};

const getAllCoursesService = async (role, userId) => {
  return await getAllCourses(role, userId);
};

const getCourseByIdService = async (courseId, role, userId) => {
  return await getCourseById(courseId, role, userId);
};

const enrollCourseService = async (studentId, courseId) => {
  const course = await getCourseById(courseId, "Student", studentId);
  if (!course) throw new Error("Không tìm thấy khóa học.");
  const startDate = formatDateTime(course.courseDate, course.courseDuration);
  const now = new Date();
  if (!startDate || startDate <= now)
    throw new Error("Khóa học đã bắt đầu, không thể đăng ký.");
  const { getCourseEnrollmentInfo } = require("../models/courseModel");
  const { currentStudent, courseMaxStudent } = await getCourseEnrollmentInfo(
    courseId
  );
  if (courseMaxStudent !== null && currentStudent >= courseMaxStudent) {
    throw new Error(
      "Khóa học đã đủ số lượng học viên, không thể đăng ký thêm."
    );
  }
  const enrolled = await isEnrolled(studentId, courseId);
  if (enrolled) {
    throw new Error("Bạn đã đăng ký khóa học này.");
  }
  await enrollCourse(studentId, courseId);
  return { message: "Đăng ký khóa học thành công." };
};

const unenrollCourseService = async (studentId, courseId) => {
  const course = await getCourseById(courseId, "Student", studentId);
  if (!course) throw new Error("Không tìm thấy khóa học.");
  const startDate = formatDateTime(course.courseDate, course.courseDuration);
  const now = new Date();
  if (!startDate || startDate <= now)
    throw new Error("Khóa học đã bắt đầu, không thể hủy đăng ký.");
  const enrolled = await isEnrolled(studentId, courseId);
  if (!enrolled) {
    throw new Error("Bạn chưa đăng ký khóa học này.");
  }
  await unenrollCourse(studentId, courseId);
  return { message: "Hủy đăng ký khóa học thành công." };
};

module.exports = {
  createCourseCategory,
  findCategoryByName: findCategoryByNameService,
  createNewCourse,
  getAllCourseCategories,
  getAllCourses: getAllCoursesService,
  getCourseById: getCourseByIdService,
  enrollCourse: enrollCourseService,
  unenrollCourse: unenrollCourseService,
  deleteCourse: deleteCourseService,
  updateCourse: updateCourseService,
  getEnrolledStudentsService,
};
