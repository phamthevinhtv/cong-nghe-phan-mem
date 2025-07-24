const {
  updateCourse,
  deleteCourse,
  createCourseCategory,
  findCategoryByName,
  createNewCourse,
  getAllCourseCategories,
  getAllCourses,
  getCourseById,
  enrollCourse,
  unenrollCourse,
  getEnrolledStudentsService,
} = require("../services/courseService");

const updateCourseController = async (req, res) => {
  try {
    const currentUser = req.user;
    if (
      !currentUser ||
      (currentUser.userRole !== "Admin" && currentUser.userRole !== "Teacher")
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const { courseId } = req.params;
    const updateData = req.body;
    try {
      const updated = await updateCourse(
        courseId,
        updateData,
        currentUser.userId,
        currentUser.userRole
      );
      res
        .status(200)
        .json({ message: "Cập nhật khóa học thành công.", course: updated });
    } catch (err) {
      if (err.message === "Không có thay đổi nào được cập nhật.") {
        return res.status(400).json({ message: err.message });
      }
      if (err.message === "Không thể cập nhật khóa học.") {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const currentUser = req.user;
    if (
      !currentUser ||
      (currentUser.userRole !== "Admin" && currentUser.userRole !== "Teacher")
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const { courseId } = req.params;
    let students;
    if (currentUser.userRole === "Teacher") {
      students = await getEnrolledStudentsService(courseId, currentUser.userId);
      if (students === null) {
        return res.status(403).json({ message: "Không có quyền truy cập." });
      }
    } else {
      students = await getEnrolledStudentsService(courseId);
    }
    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server." });
  }
};

const deleteCourseController = async (req, res) => {
  try {
    const currentUser = req.user;
    if (
      !currentUser ||
      (currentUser.userRole !== "Admin" && currentUser.userRole !== "Teacher")
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const { courseId } = req.params;
    const result = await deleteCourse(
      courseId,
      currentUser.userId,
      currentUser.userRole
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { courseCategoryName } = req.body;
    const currentUser = req.user;
    if (
      !currentUser ||
      (currentUser.userRole !== "Admin" && currentUser.userRole !== "Teacher")
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const existed = await findCategoryByName(courseCategoryName);
    if (existed)
      return res.status(400).json({ message: "Danh mục đã tồn tại." });
    const category = await createCourseCategory(courseCategoryName);
    res.status(201).json({ message: "Tạo danh mục thành công.", category });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const currentUser = req.user;
    if (
      !currentUser ||
      (currentUser.userRole !== "Admin" && currentUser.userRole !== "Teacher")
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    try {
      const course = await createNewCourse(req.body, currentUser.userId);
      res.status(201).json({ message: "Tạo khóa học thành công.", course });
    } catch (err) {
      if (err.message === "Tên khóa học đã tồn tại.") {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCourseCategories();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCoursesController = async (req, res) => {
  try {
    let role = "Guest";
    let userId = null;
    if (req.user) {
      role = req.user.userRole;
      userId = req.user.userId;
    }
    const courses = await getAllCourses(role, userId);
    // currentStudent is now included in each course object
    res.status(200).json({ courses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const currentUser = req.user;
    const role = currentUser.userRole;
    const userId = currentUser.userId;
    const course = await getCourseById(courseId, role, userId);
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học." });
    // currentStudent is now included in course object
    res.status(200).json({ course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const enrollCourseController = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.userRole !== "Student") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const { courseId } = req.params;
    try {
      const result = await enrollCourse(currentUser.userId, courseId);
      res.status(200).json(result);
    } catch (err) {
      // Nếu lỗi do đủ số lượng học viên thì trả về 400
      if (err.message.includes("đủ số lượng học viên")) {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const unenrollCourseController = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.userRole !== "Student") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const { courseId } = req.params;
    const result = await unenrollCourse(currentUser.userId, courseId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createCategory,
  createCourse,
  getAllCategories,
  getAllCourses: getAllCoursesController,
  getCourse,
  enrollCourse: enrollCourseController,
  unenrollCourse: unenrollCourseController,
  deleteCourse: deleteCourseController,
  updateCourse: updateCourseController,
  getEnrolledStudents,
};
