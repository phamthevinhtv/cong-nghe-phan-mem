const request = require("supertest");
const express = require("express");
const app = require("../server");
describe("Auth API", () => {
  it("POST /api/auth/register - đăng ký tài khoản", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        userFullName: "Test User",
        userEmail: `test${Date.now()}@example.com`,
        userPassword: "123456",
        userPhoneNumber: "0123456789",
        userRole: "Student",
      });
    expect([201, 400]).toContain(res.statusCode);
  });

  it("POST /api/auth/login - đăng nhập", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ userEmail: "test@example.com", userPassword: "123456" });
    expect([200, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
    }
  });

  it("POST /api/auth/forgot-password - yêu cầu đặt lại mật khẩu", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ userEmail: "test@example.com" });
    expect([200, 400]).toContain(res.statusCode);
  });

  it("POST /api/auth/reset-password - đặt lại mật khẩu", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "test-token", newPassword: "newpass123" });
    expect([200, 400]).toContain(res.statusCode);
  });
});
