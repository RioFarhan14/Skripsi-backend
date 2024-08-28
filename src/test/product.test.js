import supertest from "supertest";
import { web } from "../application/web.js";
import path from "path"; // Impor path
import {
  createProductField,
  createProductMembership,
  createTestAdmin,
  createTestProduct,
  createTestUser,
  removeTestAdmin,
  removeTestProduct,
  removeTestProductField,
  removeTestProductMembership,
  removeTestUser,
} from "./test-utils.js";
import { logger } from "../application/logging.js";
describe("POST /api/users/products", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestAdmin();
  });
  afterEach(async () => {
    await removeTestUser();
    await removeTestAdmin();
    await removeTestProduct();
  });

  it("Should can create products", async () => {
    const result = await supertest(web)
      .post("/api/users/products")
      .set("Authorization", "admin")
      .field("product_name", "Lapangan A")
      .field("product_type", "field")
      .field("price", 100000)
      .field("description", "product details")
      .attach("image", "C:/Users/Rio Farhan Avito/Downloads/digital.png"); // Ganti dengan path ke file yang ingin diupload

    expect(result.status).toBe(200);
    expect(result.body.data.product_name).toBe("Lapangan A");
    expect(result.body.data.product_type).toBe("field");
    expect(result.body.data.price).toBe(100000);
  });

  it("Should reject create products if invalid login", async () => {
    const result = await supertest(web)
      .post("/api/users/products")
      .set("Authorization", "abcd")
      .send({
        product_name: "Lapangan A",
        product_type: "field",
        price: 100000,
        image_url: "www.product.id",
        description: "product details",
      });
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject create products if role not admin", async () => {
    const result = await supertest(web)
      .post("/api/users/products")
      .set("Authorization", "test")
      .send({
        product_name: "Lapangan A",
        product_type: "field",
        price: 100000,
        image_url: "www.product.id",
        description: "product details",
      });
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/products", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });
  afterEach(async () => {
    await removeTestProduct();
    await removeTestUser();
  });

  it("should get all product", async () => {
    const result = await supertest(web)
      .get("/api/users/products")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeInstanceOf(Object);
  });

  it("should reject get all product if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/products")
      .set("Authorization", "abcs");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should get product by id", async () => {
    const result = await supertest(web)
      .get("/api/users/products?product_id=1")
      .set("Authorization", "test");

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("Should reject get productById if product_id invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/products")
      .set("Authorization", "test")
      .send({
        product_id: 2,
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/products/field", function () {
  beforeEach(async () => {
    await createTestUser();
    await createProductField();
  });
  afterEach(async () => {
    await removeTestProductField();
    await removeTestUser();
  });

  it("should get product field", async () => {
    const result = await supertest(web)
      .get("/api/users/products/field")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("should reject if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/products/field")
      .set("Authorization", "abcd");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/products/membership", function () {
  beforeEach(async () => {
    await createTestUser();
    await createProductMembership();
  });
  afterEach(async () => {
    await removeTestProductMembership();
    await removeTestUser();
  });

  it("should get product membership", async () => {
    const result = await supertest(web)
      .get("/api/users/products/membership")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("should reject if token invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/products/membership")
      .set("Authorization", "abcd");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/products", function () {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createTestProduct();
  });
  afterEach(async () => {
    await removeTestProduct();
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can update product", async () => {
    const result = await supertest(web)
      .patch("/api/users/products")
      .set("Authorization", "admin")
      .send({
        product_id: 1,
        product_name: "lapangan b",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.product_name).toBe("lapangan b");
  });

  it("should reject update product if token invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/products")
      .set("Authorization", "adsad")
      .send({
        product_id: 1,
        product_name: "lapangan b",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if role not admin", async () => {
    const result = await supertest(web)
      .patch("/api/users/products")
      .set("Authorization", "test")
      .send({
        product_id: 1,
        product_name: "lapangan b",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if product_id is not provided", async () => {
    const result = await supertest(web)
      .patch("/api/users/products")
      .set("Authorization", "admin")
      .send({
        product_name: "lapangan b",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/product", function () {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createTestProduct();
  });
  afterEach(async () => {
    await removeTestProduct();
    await removeTestAdmin();
    await removeTestUser();
  });

  it("should can delete product", async () => {
    const result = await supertest(web)
      .delete("/api/users/products")
      .set("Authorization", "admin")
      .send({
        product_id: 1,
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Berhasil dihapus");
  });

  it("should reject delete product if token invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/products")
      .set("Authorization", "abcd")
      .send({
        product_id: 1,
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if role not admin", async () => {
    const result = await supertest(web)
      .delete("/api/users/products")
      .set("Authorization", "test")
      .send({
        product_id: 1,
      });
    logger.info(result.body);
    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if product_id is not provided", async () => {
    const result = await supertest(web)
      .delete("/api/users/products")
      .set("Authorization", "test")
      .send({});
    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
