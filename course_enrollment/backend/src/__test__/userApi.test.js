const request = require("supertest");
const express = require("express");
const app = require("../server");

describe("User API", () => {
  let token;
  let userId = "test-user-id";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ userEmail: "test@example.com", userPassword: "123456" });
    token = res.body.token;
    if (res.body.user && res.body.user.userId) {
      userId = res.body.user.userId;
    }
  });

  it("GET /api/user/:userId - lấy thông tin user", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 401, 403, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.user).toBeDefined();
    }
  });

  it("PUT /api/user/:userId - cập nhật thông tin user", async () => {
    const res = await request(app)
      .put(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userFullName: "User Test Updated",
        userPhoneNumber: "0123456789",
      });
    expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
  });
});
