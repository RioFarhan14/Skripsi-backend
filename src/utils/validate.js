import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const validateUser = async (user_id) => {
  const user = await prismaClient.user.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user tidak ditemukan");
  }
  return user;
};

const validateMembership = async (user_id, currentTime) => {
  const result = await prismaClient.membership.findFirst({
    where: {
      user_id: user_id,
      end_date: {
        gte: currentTime,
      },
    },
  });

  return result;
};

const validateProduct = async (product_id) => {
  const product = await prismaClient.product.findUnique({
    where: {
      product_id: product_id,
    },
    select: {
      price: true,
      product_type: true,
    },
  });

  if (!product) {
    throw new ResponseError(404, "product tidak ditemukan");
  }

  return product;
};

export { validateUser, validateMembership, validateProduct };
