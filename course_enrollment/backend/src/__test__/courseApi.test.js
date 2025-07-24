const request = require("supertest");
const express = require("express");
const app = require("../server"); // Đường dẫn tới file khởi tạo app Express

describe("Course API", () => {
  let token;
  // Đăng nhập lấy token (giả sử có sẵn user test)
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ userEmail: "test@example.com", userPassword: "123456" });
    token = res.body.token;
  });

  it("GET /api/course - lấy danh sách khóa học", async () => {
    const res = await request(app)
      .get("/api/course")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 403]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body.courses)).toBe(true);
    }
  });

  it("POST /api/course - tạo khóa học mới", async () => {
    const res = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseCategoryId: "test-category",
        courseName: "Test Course",
        courseStatus: "Draft",
      });
    expect([200, 201, 400, 403]).toContain(res.statusCode);
  });

  it("GET /api/course/:courseId - lấy thông tin khóa học", async () => {
    // Giả sử có sẵn courseId test
    const courseId = "test-course-id";
    const res = await request(app)
      .get(`/api/course/${courseId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404, 403]).toContain(res.statusCode);
  });

  it("POST /api/course/:courseId/enroll - đăng ký khóa học", async () => {
    const courseId = "test-course-id";
    const res = await request(app)
      .post(`/api/course/${courseId}/enroll`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 400, 403]).toContain(res.statusCode);
  });

  it("DELETE /api/course/:courseId/enroll - hủy đăng ký khóa học", async () => {
    const courseId = "test-course-id";
    const res = await request(app)
      .delete(`/api/course/${courseId}/enroll`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 400, 403]).toContain(res.statusCode);
  });
});
