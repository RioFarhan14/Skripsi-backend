import Joi from "joi";

const getBookingByIdValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  booking_id: Joi.string().length(12).required(),
});

const getBookingByProductAndDateValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  product_id: Joi.number().integer().required(),
  booking_date: Joi.string().length(10).required(),
});

const getUserBookingValidation = Joi.string().length(11).required();

const createBookingValidation = Joi.object({
  user_id_token: Joi.string().length(11).required(),
  user_id: Joi.string().length(11).optional(),
  product_id: Joi.number().integer().required(),
  booking_date: Joi.string().length(10).required(),
  start_time: Joi.string().length(5).required(),
  duration: Joi.number().required(),
});

const updateBookingValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  booking_id: Joi.string().length(12).required(),
  product_id: Joi.number().integer().optional(),
  booking_date: Joi.string().length(10).optional(),
  start_time: Joi.string().length(5).optional(),
});

const deleteBookingValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  booking_id: Joi.string().length(12).required(),
});

export {
  getBookingByIdValidation,
  getBookingByProductAndDateValidation,
  getUserBookingValidation,
  createBookingValidation,
  updateBookingValidation,
  deleteBookingValidation,
};
