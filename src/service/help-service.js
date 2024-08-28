import { request } from "express";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createHelpValidation,
  deleteHelpValidation,
  getHelpValidation,
  updateHelpValidation,
} from "../validation/help-validation.js";
import { validateUser } from "../utils/validate.js";

const get = async (user_id) => {
  user_id = validate(getHelpValidation, user_id);

  await validateUser(user_id);

  return prismaClient.help.findMany();
};

const create = async (request) => {
  const user = validate(createHelpValidation, request);
  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  // Destrukturisasi user untuk memisahkan user_id dan help_id
  const { user_id, ...otherData } = user;

  // Masukkan properti lain ke dalam variabel data
  const data = { ...otherData };

  return prismaClient.help.create({
    data: data,
  });
};

const update = async (request) => {
  const user = validate(updateHelpValidation, request);
  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  const checkIdHelp = await prismaClient.help.count({
    where: {
      help_id: user.help_id,
    },
  });

  if (checkIdHelp !== 1) {
    throw new ResponseError(404, "help_id tidak di temukan");
  }

  // Destrukturisasi user untuk memisahkan user_id dan help_id
  const { user_id, help_id, ...otherData } = user;

  // Masukkan properti lain ke dalam variabel data
  const data = { ...otherData };

  return prismaClient.help.update({
    where: {
      help_id: user.help_id,
    },
    data: data,
  });
};

const deleteHelp = async (request) => {
  const user = validate(deleteHelpValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  const checkHelpInDatabase = await prismaClient.help.count({
    where: {
      help_id: user.help_id,
    },
  });

  if (checkHelpInDatabase !== 1) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return prismaClient.help.delete({
    where: {
      help_id: user.help_id,
    },
  });
};
export default { get, create, update, deleteHelp };
