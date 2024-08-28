import supertest from "supertest";
import { web } from "../application/web.js";
import { logger } from "../application/logging.js";
import {
  createProductField,
  createTestAdmin,
  createTestBooking,
  createTestMembership,
  createTestUser,
  createTestUser2,
  getFormattedDate,
  removeManyTestBooking,
  removeTestAdmin,
  removeTestBooking,
  removeTestMembership,
  removeTestProductField,
  removeTestUser,
  removeTestUser2,
} from "./test-utils.js";

describe("GET /api/users/booking", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
    await createProductField();
    await createTestBooking();
  });
  afterEach(async () => {
    await removeTestBooking();
    await removeTestUser();
    await removeTestAdmin();
    await removeTestProductField();
  });

  it("should can get all booking", async () => {
    const result = await supertest(web)
      .get("/api/users/booking")
      .set("Authorization", "admin");

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should can get bookingByDate", async () => {
    const result = await supertest(web)
      .get("/api/users/bookings")
      .set("Authorization", "admin")
      .query({ product_id: 2, booking_date: "2024-07-07" });

    logger.info(result.body);
    expect(result.status).toBe(200);
  });
});

describe("GET /api/users/current/booking", function () {
  beforeEach(async () => {
    await createTestUser();
    await createProductField();
    await createTestBooking();
  });
  afterEach(async () => {
    await removeTestBooking();
    await removeTestUser();
    await removeTestProductField();
  });

  it("should can get User booking", async () => {
    const result = await supertest(web)
      .get("/api/users/current/booking")
      .set("Authorization", "test");

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject get User booking if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current/booking")
      .set("Authorization", "");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/booking", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
    await createProductField();
    await createTestBooking();
  });
  afterEach(async () => {
    await removeManyTestBooking();
    await removeTestUser();
    await removeTestAdmin();
    await removeTestProductField();
  });

  it("should can create bookingByAdmin", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .post("/api/users/booking")
      .set("Authorization", "admin")
      .send({
        user_id: `00102${date}`,
        product_id: 2,
        booking_date: "2024-07-07",
        start_time: "20:00",
        duration: 1,
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Berhasil ditambahkan");
  });

  it("should can create bookingByUser", async () => {
    const result = await supertest(web)
      .post("/api/users/booking")
      .set("Authorization", "test")
      .send({
        product_id: 2,
        booking_date: "2024-07-07",
        start_time: "20:00",
        duration: 2,
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Berhasil ditambahkan");
  });

  it("should reject create if token invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/booking")
      .set("Authorization", "")
      .send({
        product_id: 2,
        booking_date: "2024-07-07",
        start_time: "20:00",
        duration: 1,
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject create if request invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/booking")
      .set("Authorization", "test")
      .send({
        product_id: 2,
        booking_date: "2024-07-07",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/booking", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestUser2();
    await createTestAdmin();
    await createTestMembership();
    await createProductField();
    await createTestBooking();
  });
  afterEach(async () => {
    await removeManyTestBooking();
    await removeTestMembership();
    await removeTestUser();
    await removeTestUser2();
    await removeTestAdmin();
    await removeTestProductField();
  });

  it("should can update BookingByAdmin", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/booking")
      .set("Authorization", "admin")
      .send({
        booking_id: `001001${date}`,
        product_id: 3,
        booking_date: "2024-07-08",
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Berhasil diubah");
  });

  it("should can update BookingByMembership", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/booking")
      .set("Authorization", "test")
      .send({
        booking_id: `001001${date}`,
        product_id: 3,
        booking_date: "2024-07-08",
        start_time: "09:00",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject update if token invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/booking")
      .set("Authorization", "")
      .send({
        booking_id: `001001${date}`,
        product_id: 3,
        booking_date: "2024-07-08",
        start_time: "09:00",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update if not admin or membership", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/booking")
      .set("Authorization", "test2")
      .send({
        booking_id: `001001${date}`,
        product_id: 3,
        booking_date: "2024-07-08",
        start_time: "09:00",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject update if request invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .patch("/api/users/booking")
      .set("Authorization", "admin")
      .send({
        product_id: 3,
        booking_date: "2024-07-08",
        start_time: "09:00",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/booking", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
    await createProductField();
    await createTestBooking();
  });
  afterEach(async () => {
    await removeTestBooking();
    await removeTestUser();
    await removeTestAdmin();
    await removeTestProductField();
  });

  it("should can delete booking", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/booking")
      .set("Authorization", "admin")
      .send({
        booking_id: `001001${date}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Berhasil dihapus");
  });

  it("should reject delete booking if token invalid", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/booking")
      .set("Authorization", "")
      .send({
        booking_id: `001001${date}`,
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject delete booking if role not admin", async () => {
    const date = getFormattedDate();
    const result = await supertest(web)
      .delete("/api/users/booking")
      .set("Authorization", "test")
      .send({
        booking_id: `001001${date}`,
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject delete booking if request invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/booking")
      .set("Authorization", "admin");

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
