import { validate } from "../validation/validation.js";
import {
  createUserValidation,
  deleteUsersValidation,
  getDataUserValidation,
  getUserIdValidation,
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUsersValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { validateMembership, validateUser } from "../utils/validate.js";
import { generateUserId, validateInput } from "../helpers/userHelper.js";
import { getCurrentTime } from "../utils/timeUtils.js";
import { logger } from "../application/logging.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);
  // Check for existing username
  const existingUsername = await prismaClient.user.findFirst({
    where: {
      username: user.username,
    },
  });

  if (existingUsername) {
    throw new ResponseError(400, "Username sudah digunakan");
  }

  // Check for existing phone number
  const existingPhone = await prismaClient.user.findFirst({
    where: {
      user_phone: user.user_phone,
    },
  });

  if (existingPhone) {
    throw new ResponseError(400, "Nomor telepon sudah digunakan");
  }

  user.password = await bcrypt.hash(user.password, 10);
  const role = "user";
  user.user_id = await generateUserId(role);

  return prismaClient.user.create({
    data: {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      password: user.password,
      user_phone: user.user_phone,
      role: role,
    },
    select: {
      username: true,
      name: true,
      user_phone: true,
    },
  });
};

const create = async (request) => {
  const user = validate(createUserValidation, request);

  // Menggunakan Promise.all untuk menjalankan query secara paralel
  const [checkUserInDatabase, existingUsername, existingPhone] =
    await Promise.all([
      prismaClient.user.findUnique({
        where: {
          user_id: user.user_id,
        },
        select: {
          role: true,
        },
      }),
      prismaClient.user.findFirst({
        where: {
          username: user.username,
        },
      }),
      prismaClient.user.findFirst({
        where: {
          user_phone: user.user_phone,
        },
      }),
    ]);

  if (!checkUserInDatabase) {
    throw new ResponseError(404, "User tidak ditemukan");
  }

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "User tidak memiliki izin");
  }

  if (existingUsername) {
    throw new ResponseError(400, "Username sudah digunakan");
  }

  if (existingPhone) {
    throw new ResponseError(400, "Nomor telepon sudah digunakan");
  }
  user.password = await bcrypt.hash(user.password, 10);
  user.user_id = await generateUserId(user.role);

  return prismaClient.user.create({
    data: {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      password: user.password,
      user_phone: user.user_phone,
      role: user.role,
    },
    select: {
      username: true,
      name: true,
      user_phone: true,
      role: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
      fcm_token: true, // tambahkan fcm_token ke hasil select query
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username atau Password salah");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username atau Password salah");
  }

  const token = uuid().toString();

  if(loginRequest.fcm_token){
    return prismaClient.user.update({
      data: {
        token: token,
        fcm_token: loginRequest.fcm_token,
      },
      where: {
        username: user.username,
      },
      select: {
        token: true,
      },
    });
  } else {
    return prismaClient.user.update({
      data: {
        token: token,
      },
      where: {
        username: user.username,
      },
      select: {
        token: true,
      },
    });
  }
};

const get = async (user_id) => {
  user_id = validate(getUserValidation, user_id);

  const currentTime = getCurrentTime();
  let isMember = await validateMembership(user_id, currentTime);
  if (isMember) {
    isMember = true;
  } else {
    false;
  }
  const user = await prismaClient.user.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      username: true,
      name: true,
      user_phone: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user tidak ditemukan");
  }
  user.isMember = isMember;
  return user;
};

const getUsers = async (user_id) => {
  user_id = validate(getUserValidation, user_id);

  const checkUserInDatabase = await validateUser(user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  return prismaClient.user.findMany({
    select: {
      user_id: true,
      username: true,
      name: true,
      user_phone: true,
      role: true,
    },
  });
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  //validate user_id
  await validateUser(user.user_id);

  const data = await validateInput(user);

  return prismaClient.user.update({
    where: {
      user_id: user.user_id,
    },
    data: data,
    select: {
      username: true,
      name: true,
      user_phone: true,
    },
  });
};

const updateUsers = async (request) => {
  const user = validate(updateUsersValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id_token);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }
  const checkUserId = await prismaClient.user.count({
    where: {
      user_id: user.user_id,
    },
  });

  if (checkUserId !== 1) {
    throw new ResponseError(404, "user_id tidak ditemukan");
  }

  const data = await validateInput(user);

  return prismaClient.user.update({
    where: {
      user_id: user.user_id,
    },
    data: data,
    select: {
      username: true,
      name: true,
      user_phone: true,
    },
  });
};

const logout = async (username) => {
  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user tidak ditemukan");
  }

  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
      fcm_token: null,
    },
  });
};

const deleteUsers = async (request) => {
  const user = validate(deleteUsersValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id_token);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }
  const checkUserId = await prismaClient.user.count({
    where: {
      user_id: user.user_id,
    },
  });

  if (checkUserId !== 1) {
    throw new ResponseError(404, "user_id tidak ditemukan");
  }

  return prismaClient.user.delete({
    where: {
      user_id: user.user_id,
    },
  });
};

const getUserId = async (request) => {
  const user = validate(getUserIdValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id_token);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  const result = await prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      user_id: true,
    },
  });
  if(!result){
    throw new ResponseError(404, "username tidak ditemukan");
  }
  return result;
}

const getDataUser = async (request) => {
  const user = validate(getDataUserValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id_token);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }

  const result = await prismaClient.user.findUnique({
    where: {
      user_id: user.user_id,
    },
    select: {
      name: true,
      user_phone: true,
      role: true,
      username: true,
    },
  });
  if(!result){
    throw new ResponseError(404, "username tidak ditemukan");
  }
  return result;
}

const validateAdmin = async (user_id) => {
  const checkUserInDatabase = await validateUser(user_id);
  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin");
  }
  return;
}
export default {
  register,
  login,
  validateAdmin,
  get,
  update,
  logout,
  create,
  getUsers,
  updateUsers,
  deleteUsers,
  getUserId,
  getDataUser
};
