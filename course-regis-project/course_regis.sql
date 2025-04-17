-- Bảng người dùng
CREATE TABLE users (
  userId VARCHAR(50),
  googleId VARCHAR(100),
  userFullName VARCHAR(255) NOT NULL,
  userEmail VARCHAR(255) NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  userGender VARCHAR(10),
  userPhoneNumber VARCHAR(20),
  userAddress VARCHAR(500),
  userRole VARCHAR(50),
  userOtp VARCHAR(10),
  userOtpExpire DATETIME,
  userStatus VARCHAR(50),
  userCreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userUpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT PK_users PRIMARY KEY (userId),
  CONSTRAINT UQ_userEmail UNIQUE (userEmail),
  CONSTRAINT UQ_userPhoneNumber UNIQUE (userPhoneNumber)
);

-- Bảng danh mục khóa học
CREATE TABLE courseCategories (
    courseCategoryId VARCHAR(50),
    courseCategoryName VARCHAR(100) NOT NULL,
    CONSTRAINT PK_courseCategories PRIMARY KEY (courseCategoryId)
);

-- Bảng khóa học
CREATE TABLE courses (
    courseId VARCHAR(50),
    userId VARCHAR(50) NOT NULL,
    courseCategoryId VARCHAR(50),
    courseName VARCHAR(255) NOT NULL,
    courseDescription TEXT,
    courseStartDate DATE,
    courseEndDate DATE,
    courseMaxStudent SMALLINT,
    coursePrice DECIMAL(10, 2),
    courseStatus VARCHAR(50),
    courseCreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    courseUpdateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT PK_courses PRIMARY KEY (courseId),
    CONSTRAINT FK_courses_userId FOREIGN KEY (userId) REFERENCES users(userId),
    CONSTRAINT FK_courses_courseCategoryId FOREIGN KEY (courseCategoryId) REFERENCES courseCategories(courseCategoryId) ON DELETE SET NULL
);

-- Bảng đăng ký khóa học
CREATE TABLE enrollments (
    enrollmentId VARCHAR(50),
    userId VARCHAR(50) NOT NULL,
    courseId VARCHAR(50) NOT NULL,
    enrollmentStatus VARCHAR(50),
    enrollmentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_enrollments PRIMARY KEY (enrollmentId),
    CONSTRAINT FK_enrollments_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    CONSTRAINT FK_enrollments_courseId FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE,
    CONSTRAINT UQ_enrollments UNIQUE (userId, courseId) 
);

-- Bảng buổi học
CREATE TABLE sessions (
    sessionId VARCHAR(50),
    courseId VARCHAR(50) NOT NULL,
    sessionName VARCHAR(100) NOT NULL,
    sessionDate DATE NOT NULL,
    sessionStartTime TIME,
    sessionEndTime TIME,
    sessionStatus VARCHAR(50),
    CONSTRAINT PK_sessions PRIMARY KEY (sessionId),
    CONSTRAINT FK_sessions_courseId FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
);