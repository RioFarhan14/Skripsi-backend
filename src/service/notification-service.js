import { request } from "express";
import {
  createCategoryOnNotificationValidation,
  createNotificationReadValidation,
  createNotificationValidation,
  getNotificationUserValidation,
} from "../validation/notification-validation.js";
import { validate } from "../validation/validation.js";
import { validateUser } from "../utils/validate.js";
import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import { formattedDate } from "../utils/timeUtils.js";
import {
  sendPushNotification,
  sendPushNotificationAll,
} from "../utils/firebase-admin.js";

const create = async (request) => {
  const user = validate(createNotificationValidation, request);

  if (user.user_id_token) {
    const checkRole = await validateUser(user.user_id_token);
    if (checkRole.role !== "admin") {
      throw new ResponseError(403, "User tidak memiliki izin");
    }
  }

  if (user.user_id) {
    const result = await prismaClient.notification.create({
      data: {
        user_id: user.user_id,
        title: user.title,
        category_id: user.category_id,
        message: user.message,
      },
      select: {
        notification_id: true,
      },
    });
    const fcm_token = await prismaClient.user.findUnique({
      where: {
        user_id: user.user_id,
      },
      select: {
        fcm_token: true,
      },
    });
    try {
      await sendPushNotification(
        fcm_token.fcm_token,
        user.title,
        user.message,
        result.notification_id
      );
    } catch (error) {
      console.log(error);
    }
    return;
  }

  const result = await prismaClient.notification.create({
    data: {
      title: user.title,
      category_id: user.category_id,
      message: user.message,
    },
    select: {
      notification_id: true,
    },
  });

  await sendPushNotificationAll(
    user.title,
    user.message,
    result.notification_id
  );
  return;
};

const createCategoryNotif = async (request) => {
  const user = validate(createCategoryOnNotificationValidation, request);

  const checkRole = await validateUser(user.user_id);
  if (checkRole.role !== "admin") {
    throw new ResponseError(403, "User tidak memiliki izin");
  }

  return prismaClient.categoryOnNotification.create({
    data: {
      category_name: user.name,
    },
  });
};

const getNotificationsData = async (user_id) => {
  // Validasi user_id dan validasi user
  user_id = validate(getNotificationUserValidation, user_id);
  await validateUser(user_id);

  // Ambil data notifikasi, notifikasi yang dibaca, dan kategori notifikasi
  let [notifications, notificationReads, notificationCategories] =
    await Promise.all([
      prismaClient.notification.findMany({
        where: {
          OR: [
            { user_id: user_id }, // Kondisi pertama: user_id sama dengan nilai tertentu
            { user_id: null }, // Kondisi kedua: user_id adalah null
          ],
        },
      }),
      prismaClient.notificationRead.findMany({
        where: {
          user_id: user_id,
        },
      }),
      prismaClient.categoryOnNotification.findMany({}),
    ]);

  notifications = notifications.map((notification) => ({
    ...notification,
    time: formattedDate(notification.time, "YYYY-MM-DD HH:mm:ss"),
  }));

  // Kembalikan hasil dalam satu objek
  return {
    notifications,
    notificationReads,
    notificationCategories,
  };
};

const createNotficationIsRead = async (request) => {
  const user = validate(createNotificationReadValidation, request);

  await validateUser(user.user_id);

  const checkNotificationId = await prismaClient.notification.findUnique({
    where: {
      notification_id: user.notification_id,
    },
  });

  if (!checkNotificationId) {
    throw new ResponseError(400, "notification_id tidak ditemukan");
  }

  const checkNotificationRead = await prismaClient.notificationRead.findFirst({
    where: {
      user_id: user.user_id,
      notification_id: user.notification_id,
    },
  });

  if (checkNotificationRead) {
    // Jika notifikasi sudah ada, lakukan update
    await prismaClient.notificationRead.updateMany({
      where: {
        user_id: user.user_id,
        notification_id: user.notification_id,
      },
      data: {
        is_read: true,
      },
    });

    // Ambil data yang telah diperbarui
    return prismaClient.notificationRead.findMany({
      where: {
        user_id: user.user_id,
        notification_id: user.notification_id,
      },
    });
  }

  return prismaClient.notificationRead.create({
    data: {
      notification_id: user.notification_id,
      user_id: user.user_id,
      is_read: true,
    },
  });
};

const getAllNotifications = async (user_id) => {
  user_id = validate(getNotificationUserValidation, user_id);
  const role = await validateUser(user_id);
  if (role.role !== "admin") {
    throw new ResponseError(403, "User tidak memiliki izin");
  }
  const data = await prismaClient.notification.findMany({
    select: {
      notification_id: true,
      title: true,
      category: {
        select: {
          category_name: true,
        },
      },
      message: true,
      user_id: true,
    },
  });

  const result = data.map((notification) => ({
    id: notification.notification_id,
    title: notification.title,
    description: notification.message,
    category: notification.category.category_name,
    user_id: notification.user_id === null ? "Semua" : notification.user_id,
  }));
  return result;
};

export default {
  create,
  createNotficationIsRead,
  getNotificationsData,
  createCategoryNotif,
  getAllNotifications,
};
