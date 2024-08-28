import { request } from "express";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createBookingValidation,
  deleteBookingValidation,
  getBookingByIdValidation,
  getBookingByProductAndDateValidation,
  getUserBookingValidation,
  updateBookingValidation,
} from "../validation/booking-validation.js";
import {
  formattedDate,
  getCurrentTime,
  getDuration,
  getEndTime,
} from "../utils/timeUtils.js";
import { validateMembership, validateUser } from "../utils/validate.js";
import {
  calculateEndTime,
  generateBookingId,
  isValidBooking,
  validateBookingId,
  validateLimitTime,
  validateSchedule,
} from "../helpers/bookingHelpers.js";

const getAllBooking = async (user_id) => {
  user_id = validate(getUserBookingValidation, user_id);

  // Cek apakah user ada di database
  const checkUserInDatabase = await validateUser(user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "User tidak memiliki izin");
  }
  const currentTime = formattedDate(getCurrentTime(), "YYYY-MM-DD");
  const result = await prismaClient.booking.findMany({
    where: {
      booking_date: {
        gte: currentTime,
      },
    },
    select: {
      booking_id: true,
      booking_date: true,
      start_time: true,
      end_time: true,
      user: {
        select: {
          name: true,
        },
      },
      product: {
        select: {
          product_name: true,
        },
      },
    },
  });

  const data = result.map((item) => {
    return {
      booking_id: item.booking_id,
      booking_date: item.booking_date,
      start_time: item.start_time,
      end_time: item.end_time,
      user_name: item.user.name,
      product_name: item.product.product_name,
    };
  });
  return data;
};

const getBookingByProductAndDate = async (request) => {
  const user = validate(getBookingByProductAndDateValidation, request);

  // Cek apakah user ada di database
  await validateUser(user.user_id);

  const result = await prismaClient.booking.findMany({
    where: {
      product_id: user.product_id,
      booking_date: user.booking_date,
      OR: [{ status: "Booked" }, { status: "Ongoing" }],
    },
    select: {
      booking_id: true,
      product_id: true,
      booking_date: true,
      status: true,
      start_time: true,
      end_time: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return result;
};

const getUserBooking = async (user_id) => {
  user_id = validate(getUserBookingValidation, user_id);

  await validateUser(user_id);

  return prismaClient.booking.findMany({
    where: {
      user_id: user_id,
      OR: [{ status: "Booked" }, { status: "Ongoing" }, { status: "Pending" }],
    },
    select: {
      booking_id: true,
      product_id: true,
      transaction: {
        select: {
          snap_token: true,
        },
      },
      status: true,
      booking_date: true,
      start_time: true,
      end_time: true,
    },
  });
};

const createBooking = async (request) => {
  const data = validate(createBookingValidation, request);
  const checkUserInDatabase = await validateUser(data.user_id_token);

  const status = "Pending";

  if (isValidBooking(data.booking_date, data.start_time) == false) {
    throw new ResponseError(
      400,
      "Tanggal dan waktu booking tidak boleh kurang dari waktu saat ini."
    );
  }

  data.end_time = calculateEndTime(data.start_time, data.duration);

  // Cek waktu tidak boleh kurang dari 09:00 dan lebih dari 22:00

  const startLimit = "09:00";
  const endLimit = "22:00";

  if (data.start_time < startLimit || data.end_time > endLimit) {
    throw new ResponseError(
      400,
      "waktu harus lebih dari 09:00 dan kurang dari 22:00"
    );
  }

  // Cek jadwal yang bertabrakan
  await validateSchedule(data);

  if (checkUserInDatabase.role === "user") {
    data.booking_id = await generateBookingId(data.user_id_token);
    await prismaClient.booking.create({
      data: {
        booking_id: data.booking_id,
        status: status,
        booking_date: data.booking_date,
        start_time: data.start_time,
        end_time: data.end_time,
        user: {
          connect: {
            user_id: data.user_id_token,
          },
        },
        product: {
          connect: {
            product_id: data.product_id,
          },
        },
      },
    });

    const result = {};
    result.booking_id = data.booking_id;
    result.user_id_token = data.user_id_token;
    result.product_id = data.product_id;
    result.quantity = data.duration;
    return result;
  }
  if (!data.user_id) {
    throw new ResponseError(400, "Masukkan user_id");
  }
  data.booking_id = await generateBookingId(data.user_id_token);
  await prismaClient.booking.create({
    data: {
      booking_id: data.booking_id,
      status: status,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      user: {
        connect: {
          user_id: data.user_id,
        },
      },
      product: {
        connect: {
          product_id: data.product_id,
        },
      },
    },
  });

  const result = {
    booking_id: data.booking_id,
    user_id_token: data.user_id_token,
    user_id: data.user_id,
    product_id: data.product_id,
    quantity: data.duration,
  };

  return result;
};

const update = async (request) => {
  const user = validate(updateBookingValidation, request);
  const set = {};
  set.booking_id = user.booking_id;
  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role === "user") {
    const currentTime = getCurrentTime();
    set.user_id = user.user_id;
    const checkMembership = await validateMembership(set.user_id, currentTime);

    if (!checkMembership) {
      throw new ResponseError(403, "User tidak memiliki izin");
    }
  }

  const checkBookingId = await validateBookingId(set);

  const duration = getDuration(
    checkBookingId.start_time,
    checkBookingId.end_time
  );

  // Cek user.start_time tidak ada gunakan checkBookingId.start_time
  user.start_time = user.start_time
    ? user.start_time
    : checkBookingId.start_time;

  // Cek user.booking_date jika tidak ada gunakan checkBookingId.booking_date
  user.booking_date = user.booking_date
    ? user.booking_date
    : checkBookingId.booking_date;

  // Cek user.product_id jika tidak ada gunakan  checkBookingId.product_id
  user.product_id = user.product_id
    ? user.product_id
    : checkBookingId.product_id;

  user.end_time = getEndTime(user.start_time, duration);

  // Cek waktu tidak boleh kurang dari 09:00 dan lebih dari 22:00
  validateLimitTime(user.start_time, user.end_time);

  // Cek jadwal yang bertabrakan
  await validateSchedule(user);

  const { user_id, ...otherData } = user;

  const data = { ...otherData, notification_sent: false };

  return prismaClient.booking.update({
    where: {
      booking_id: data.booking_id,
    },
    data: data,
    select: {
      booking_id: true,
      product_id: true,
      transaction: {
        select: {
          snap_token: true,
        },
      },
      status: true,
      booking_date: true,
      start_time: true,
      end_time: true,
    },
  });
};

const deleteBooking = async (request) => {
  const user = validate(deleteBookingValidation, request);

  const checkUserInDatabase = await validateUser(user.user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin akses");
  }

  return prismaClient.booking.delete({
    where: {
      booking_id: user.booking_id,
    },
  });
};

const updateTransactionFail = async (transaction_id) => {
  const transaction = await prismaClient.transaction.findUnique({
    where: {
      transaction_id: transaction_id,
    },
    select: {
      booking_id: true,
      status: true,
    },
  });

  if (transaction.status !== "PENDING") {
    return;
  }

  await prismaClient.transaction.update({
    where: {
      transaction_id: transaction_id,
    },
    data: {
      status: "CANCELLED",
      snap_token: null,
      snap_redirect_url: null,
    },
  });
  if (!transaction.booking_id) {
    return;
  }
  return prismaClient.booking.update({
    where: {
      booking_id: transaction.booking_id,
    },
    data: {
      status: "Cancelled",
    },
  });
};

export default {
  getAllBooking,
  getBookingByProductAndDate,
  getUserBooking,
  createBooking,
  updateTransactionFail,
  update,
  deleteBooking,
};
