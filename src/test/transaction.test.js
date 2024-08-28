import supertest from "supertest";
import { web } from "../application/web.js";
import { logger } from "../application/logging.js";
import {
  createProductField,
  createProductMembership,
  createTestAdmin,
  createTestMembership,
  createTestUser,
  getFormattedDate,
  removeManyTestBooking,
  removeManyTestTransaction,
  removeTestAdmin,
  removeTestMembership,
  removeTestProductField,
  removeTestProductMembership,
  removeTestUser,
} from "./test-utils.js";

describe("GET /api/users/transaction", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can getAllTransaction", async () => {
    const result = await supertest(web)
      .get("/api/users/transaction")
      .set("Authorization", "admin");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject getAllTransaction if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/transaction")
      .set("Authorization", "");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject getAllTransaction if role not admin", async () => {
    const result = await supertest(web)
      .get("/api/users/transaction")
      .set("Authorization", "test");

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current/transaction", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can getUserTransaction", async () => {
    const result = await supertest(web)
      .get("/api/users/current/transaction")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject getUserTransaction if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current/transaction")
      .set("Authorization", "");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject getUserTransaction if role not user", async () => {
    const result = await supertest(web)
      .get("/api/users/current/transaction")
      .set("Authorization", "admin");

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/transaction", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
    await createTestMembership();
    await createProductField();
    await createProductMembership();
  });
  afterEach(async () => {
    await removeManyTestBooking();
    await removeManyTestTransaction();
    await removeTestMembership();
    await removeTestAdmin();
    await removeTestUser();
    await removeTestProductField();
    await removeTestProductMembership();
  });

  it("should can create transaction field", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .post("/api/users/transaction")
      .set("Authorization", "admin")
      .send({
        user_id: `00102${date}`,
        product_id: 2,
        booking_date: "2024-07-07",
        start_time: "20:00",
        duration: 1,
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });
  it("should can create transaction membership", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .post("/api/users/transaction")
      .set("Authorization", "admin")
      .send({
        user_id: `00102${date}`,
        product_id: 5,
        quantity: 1,
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject create transaction if token invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .post("/api/users/transaction")
      .set("Authorization", "")
      .send({
        product_id: 2,
        quantity: 2,
      });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
