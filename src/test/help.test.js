import supertest from "supertest";
import { web } from "../application/web.js";
import { logger } from "../application/logging.js";
import {
  createTestAdmin,
  createTestHelp,
  createTestUser,
  removeHelpTest,
  removeTestAdmin,
  removeTestUser,
} from "./test-utils.js";
import { prismaClient } from "../application/database.js";

describe("GET /api/users/help", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get help information", async () => {
    const result = await supertest(web)
      .get("/api/users/help")
      .set("Authorization", "test");

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject get help information if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/help")
      .set("Authorization", "abcd");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/help", function () {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
  });
  afterEach(async () => {
    await removeHelpTest();
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can create help information", async () => {
    const result = await supertest(web)
      .post("/api/users/help")
      .set("Authorization", "admin")
      .send({
        title: "Booking",
        message: "Booking bisa dilakukan dengan metode pembayaran gopay",
      });
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject create help information if token invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/help")
      .set("Authorization", "abcd")
      .send({
        title: "Booking",
        message: "Booking bisa dilakukan dengan metode pembayaran gopay",
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject create help information if user not admin", async () => {
    const result = await supertest(web)
      .post("/api/users/help")
      .set("Authorization", "test")
      .send({
        title: "Booking",
        message: "Booking bisa dilakukan dengan metode pembayaran gopay",
      });
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject create help information if request invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/help")
      .set("Authorization", "admin")
      .send({
        title: "Booking",
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/help", function () {
  beforeEach(async () => {
    await createTestHelp();
    await createTestAdmin();
    await createTestUser();
  });
  afterEach(async () => {
    await removeHelpTest();
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can update help information", async () => {
    const result = await supertest(web)
      .patch("/api/users/help")
      .set("Authorization", "admin")
      .send({
        help_id: 1,
        message: "silahkan hubungi 08xxxxxxx",
      });
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject update help information if token invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/help")
      .set("Authorization", "abcd")
      .send({
        help_id: 1,
        message: "silahkan hubungi 08xxxxxxx",
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update help information if user not admin", async () => {
    const result = await supertest(web)
      .patch("/api/users/help")
      .set("Authorization", "test")
      .send({
        help_id: 1,
        message: "silahkan hubungi 08xxxxxxx",
      });
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update help information if invalid request", async () => {
    const result = await supertest(web)
      .patch("/api/users/help")
      .set("Authorization", "admin")
      .send({
        message: "silahkan hubungi 08xxxxxxx",
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/help", function () {
  beforeEach(async () => {
    await createTestHelp();
    await createTestAdmin();
    await createTestUser();
  });
  afterEach(async () => {
    await removeHelpTest();
    await removeTestAdmin();
    await removeTestUser();
  });

  it("Should can delete help inforamtion", async () => {
    const result = await supertest(web)
      .delete("/api/users/help")
      .set("Authorization", "admin")
      .send({
        help_id: 1,
      });
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Data berhasil dihapus");
  });

  it("Should reject delete help inforamtion if token invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/help")
      .set("Authorization", "adbsv")
      .send({
        help_id: 1,
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject delete help inforamtion if user not admin", async () => {
    const result = await supertest(web)
      .delete("/api/users/help")
      .set("Authorization", "test")
      .send({
        help_id: 1,
      });
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject delete help inforamtion if request invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/help")
      .set("Authorization", "admin")
      .send({});
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
