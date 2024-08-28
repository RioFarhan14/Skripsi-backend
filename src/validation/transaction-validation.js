import Joi from "joi";

const getTransactionValidation = Joi.string().min(11).max(11).required();

const createTransactionValidation = Joi.object({
  user_id_token: Joi.string().min(11).max(11).required(),
  booking_id: Joi.string().length(12).optional(),
  user_id: Joi.string().min(11).max(11).optional(),
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
});

export { getTransactionValidation, createTransactionValidation };
