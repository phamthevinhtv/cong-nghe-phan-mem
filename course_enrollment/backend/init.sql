-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
  userId VARCHAR(50) NOT NULL,
  googleId VARCHAR(50) NULL,
  userFullName VARCHAR(255) NOT NULL,
  userEmail VARCHAR(255) NOT NULL,
  userPhoneNumber VARCHAR(15) NULL,
  userPassword VARCHAR(255) NOT NULL,
  userRole VARCHAR(20) NOT NULL,
  userOtp VARCHAR(50) NULL,
  userOtpExpire DATETIME NULL,
  CONSTRAINT PK_users PRIMARY KEY (userId),
  CONSTRAINT UQ_userEmail UNIQUE (userEmail),
  CONSTRAINT UQ_googleId UNIQUE (googleId)
);

-- Bảng danh mục khóa học
CREATE TABLE IF NOT EXISTS courseCategories (
    courseCategoryId VARCHAR(50) NOT NULL,
    courseCategoryName VARCHAR(100) NOT NULL,
    CONSTRAINT PK_courseCategories PRIMARY KEY (courseCategoryId)
);

-- Bảng khóa học
CREATE TABLE IF NOT EXISTS courses (
    courseId VARCHAR(50) NOT NULL,
    userId VARCHAR(50) NULL,
    courseCategoryId VARCHAR(50) NULL,
    courseName VARCHAR(255) NOT NULL,
    courseImage VARCHAR(255) NULL,
    courseDescription TEXT NULL,
    courseDate DATE NULL,
    courseDuration VARCHAR(20) NULL,
    courseLocation VARCHAR(50) NULL,
    coursePlatform VARCHAR(50) NULL,
    courseMaxStudent SMALLINT NULL,
    coursePrice DECIMAL(10, 2) DEFAULT 0,
    courseStatus VARCHAR(50) NOT NULL,
    CONSTRAINT PK_courses PRIMARY KEY (courseId),
    CONSTRAINT FK_courses_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE RESTRICT,
    CONSTRAINT FK_courses_courseCategoryId FOREIGN KEY (courseCategoryId) REFERENCES courseCategories(courseCategoryId) ON DELETE SET NULL
);

-- Bảng đăng ký khóa học
CREATE TABLE IF NOT EXISTS enrollments (
    userId VARCHAR(50) NOT NULL,
    courseId VARCHAR(50) NOT NULL,
    CONSTRAINT PK_enrollments PRIMARY KEY (userId, courseId),
    CONSTRAINT FK_enrollments_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT FK_enrollments_courseId FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
);
