import Joi from "joi";

const createNotificationValidation = Joi.object({
  user_id_token: Joi.string().length(11).optional(),
  user_id: Joi.string().length(11).optional(),
  title: Joi.string().min(3).required(),
  message: Joi.string().min(3).required(),
  category_id: Joi.number().required(),
});

const createCategoryOnNotificationValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  name: Joi.string().min(3).max(10).required(),
});

const getNotificationUserValidation = Joi.string().length(11).required();

const createNotificationReadValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  notification_id: Joi.number().integer().required(),
});
export {
  createNotificationValidation,
  getNotificationUserValidation,
  createNotificationReadValidation,
  createCategoryOnNotificationValidation,
};
