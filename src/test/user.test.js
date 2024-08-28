import { logger } from "../application/logging.js";
import { web } from "../application/web.js";
import supertest from "supertest";
import {
  createTestAdmin,
  createTestUser,
  createTestUser2,
  getFormattedDate,
  removeTestAdmin,
  removeTestUser,
  removeTestUser2,
  removeTestUsername,
} from "./test-utils.js";

describe("POST /api/users/create", function () {
  beforeEach(async () => {
    await createTestUser2();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestUser2();
    await removeTestAdmin();
    await removeTestUsername();
  });
  it("should can create user", async () => {
    const result = await supertest(web)
      .post("/api/users/create")
      .set("Authorization", "admin")
      .send({
        username: "test",
        name: "Cassilas",
        user_phone: "12345670000",
        role: "user",
        password: "12345678",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject create if token invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/create")
      .set("Authorization", "")
      .send({
        username: "cassilas",
        name: "Cassilas",
        user_phone: "08212345678",
        role: "user",
        password: "12345678",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject create if role not admin", async () => {
    const result = await supertest(web)
      .post("/api/users/create")
      .set("Authorization", "test2")
      .send({
        username: "cassilas",
        name: "Cassilas",
        user_phone: "08212345678",
        role: "user",
        password: "12345678",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject create if request invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/create")
      .set("Authorization", "test2")
      .send({
        username: "cassilas",
        name: "Cassilas",
        user_phone: "08212345678",
        role: "user",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/update", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestUser();
    await removeTestAdmin();
  });

  it("should can update data users", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "admin")
      .send({
        user_id: `00102${date}`,
        name: "Cassilas",
      });
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject update if token invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "")
      .send({
        user_id: `00102${date}`,
        username: "cassilas",
        name: "Cassilas",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update if role not admin", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        user_id: `00102${date}`,
        name: "Cassilas",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update if request invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/update")
      .set("Authorization", "test")
      .send({
        name: "Cassilas",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/delete", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestUser();
    await removeTestAdmin();
  });

  it("should can delete users", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/delete")
      .set("Authorization", "admin")
      .send({
        user_id: `00102${date}`,
      });
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Behasil Dihapus");
  });

  it("should reject delete if token invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/delete")
      .set("Authorization", "")
      .send({
        user_id: `00102${date}`,
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject delete if role not admin", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/delete")
      .set("Authorization", "test")
      .send({
        user_id: `00102${date}`,
      });
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject delete if request invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/delete")
      .set("Authorization", "admin");

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUsername();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "1234567890",
      confirm_password: "1234567890",
      name: "test",
      user_phone: "0812345678910",
    });
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.user_phone).toBe("0812345678910");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      confirm_password: "",
      name: "",
      user_phone: "",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "1234567890",
      confirm_password: "1234567890",
      name: "test",
      user_phone: "0812345678910",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.user_phone).toBe("0812345678910");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "1234567890",
      confirm_password: "1234567890",
      name: "test",
      user_phone: "0812345678911",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user_phone already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "1234567890",
      confirm_password: "1234567890",
      name: "test",
      user_phone: "0812345678910",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.user_phone).toBe("0812345678910");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "admin",
      password: "1234567890",
      confirm_password: "1234567890",
      name: "test",
      user_phone: "0812345678910",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("Should login success", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "1234567890",
    });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("should reject login if request invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });
    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "12345675456",
    });
    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "testi",
      password: "1234567890",
    });
    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestUser();
    await removeTestAdmin();
  });

  it("should can get users", async () => {
    const result = await supertest(web)
      .get("/api/users")
      .set("Authorization", "admin");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject get users if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users")
      .set("Authorization", "");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject get users if role not admin", async () => {
    const result = await supertest(web)
      .get("/api/users")
      .set("Authorization", "test");

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.user_phone).toBe("12345678910");
  });

  it("should reject get user if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "admin");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestUser2();
  });
  afterEach(async () => {
    await removeTestUser();
    await removeTestUser2();
  });
  it("should can update user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "Rio",
        user_phone: "081234659392",
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Rio");
    expect(result.body.data.user_phone).toBe("081234659392");
  });

  it("should reject if username already registered", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        username: "Riofarhan",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user_phone already registered", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        user_phone: "12345678911",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request not valid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test123")
      .send({});

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/logout", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
  });
});
