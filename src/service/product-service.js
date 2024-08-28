import { request } from "express";
import { validate } from "../validation/validation.js";
import {
  createProductValidation,
  deleteProductValidation,
  getProductValidation,
  updateProductValidation,
} from "../validation/product-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user-validation.js";
import { generateProductId } from "../utils/generateIdUtils.js";
import { validateProduct, validateUser } from "../utils/validate.js";

const create = async (request) => {
  const user = validate(createProductValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "User tidak memiliki izin");
  }

  const data = {};

  data.product_id = await generateProductId();
  if (user.product_name) {
    data.product_name = user.product_name;
  }
  if (user.product_type) {
    data.product_type = user.product_type;
  }
  if (user.price) {
    data.price = user.price;
  }
  if (user.image_url) {
    data.image_url = user.image_url;
  }
  if (user.description) {
    data.description = user.description;
  }

  return prismaClient.product.create({
    data: data,
    select: {
      product_name: true,
      product_type: true,
      price: true,
      image_url: true,
    },
  });
};

const get = async (request) => {
  const user = validate(getProductValidation, request);
  await validateUser(user.user_id);

  if (user.product_id) {
    const product = await prismaClient.product.findUnique({
      where: {
        product_id: user.product_id,
      },
    });
    if (!product) {
      throw new ResponseError(404, "produk tidak ditemukan");
    }

    return product;
  }

  return prismaClient.product.findMany();
};

const getField = async (user_id) => {
  user_id = validate(getUserValidation, user_id);
  await validateUser(user_id);

  const product = "field";
  return prismaClient.product.findMany({
    where: {
      product_type: product,
    },
  });
};

const getMembership = async (user_id) => {
  user_id = validate(getUserValidation, user_id);
  await validateUser(user_id);
  const product = "membership";
  return prismaClient.product.findMany({
    where: {
      product_type: product,
    },
  });
};

const update = async (request) => {
  const user = validate(updateProductValidation, request);
  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  await validateProduct(user.product_id);

  // Destrukturisasi user untuk memisahkan user_id dan product_id
  const { user_id, product_id, ...otherData } = user;

  // Masukkan properti lain ke dalam variabel data
  const data = { ...otherData };

  return await prismaClient.product.update({
    where: {
      product_id: user.product_id,
    },
    data: data,
  });
};

const deleteProduct = async (request) => {
  const user = validate(deleteProductValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  const checkProductInDatabase = await prismaClient.product.count({
    where: {
      product_id: user.product_id,
    },
  });

  if (checkProductInDatabase !== 1) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return prismaClient.product.delete({
    where: {
      product_id: user.product_id,
    },
  });
};

export default {
  create,
  get,
  getField,
  getMembership,
  update,
  deleteProduct,
};
