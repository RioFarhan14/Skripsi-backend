import notificationService from "../service/notification-service.js";

const create = async (req, res, next) => {
  try {
    const user_id_token = req.user.user_id;
    const request = req.body;
    request.user_id_token = user_id_token;
    const result = await notificationService.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createCategoryNotif = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    const result = await notificationService.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await notificationService.getNotificationsData(
      req.user.user_id
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const notifIsRead = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    const result = await notificationService.createNotficationIsRead(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const result = await notificationService.getAllNotifications(user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  createCategoryNotif,
  get,
  notifIsRead,
  getAllNotifications,
};
