import Joi from "joi";

const createProductValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  product_name: Joi.string().min(1).max(20).required(),
  product_type: Joi.string().required(),
  price: Joi.number().min(4).integer().required(),
  image_url: Joi.string().required(),
  description: Joi.string().optional(),
});

const getProductValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  product_id: Joi.number().integer().optional(),
});

const updateProductValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  product_id: Joi.number().integer().required(),
  product_name: Joi.string().min(3).max(20).optional(),
  product_type: Joi.string().optional(),
  price: Joi.number().min(4).integer().optional(),
  image_url: Joi.string().min(4).optional(),
  description: Joi.string().optional(),
});

const deleteProductValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  product_id: Joi.number().integer().required(),
});
export {
  createProductValidation,
  getProductValidation,
  updateProductValidation,
  deleteProductValidation,
};
