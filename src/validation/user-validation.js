import Joi from "joi";

const createUserValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(3).max(64).required(),
  role: Joi.string().valid("admin", "user").required(),
  name: Joi.string().max(60).required(),
  user_phone: Joi.string()
    .min(11)
    .max(13)
    .pattern(/^[0-9]+$/)
    .required(),
});

const registerUserValidation = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(3).max(64).required(),
  confirm_password: Joi.ref("password"),
  name: Joi.string().max(60).required(),
  user_phone: Joi.string()
    .min(11)
    .max(13)
    .pattern(/^[0-9]+$/)
    .required(),
});

const loginUserValidation = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(3).max(64).required(),
  fcm_token: Joi.string().optional(),
});

const getUserValidation = Joi.string().min(11).max(11).required();

const getUserIdValidation = Joi.object({
  user_id_token: Joi.string().min(11).max(11).required(),
  username: Joi.string().required(),
})

const getDataUserValidation = Joi.object({
  user_id_token: Joi.string().min(11).max(11).required(),
  user_id: Joi.string().min(11).max(11).required(),
})

const updateUserValidation = Joi.object({
  user_id: Joi.string().min(11).max(11).required(),
  username: Joi.string().min(3).max(15).optional(),
  password: Joi.string().min(3).max(64).optional(),
  name: Joi.string().max(60).optional(),
  user_phone: Joi.string()
    .min(11)
    .max(13)
    .pattern(/^[0-9]+$/)
    .optional(),
});

const updateUsersValidation = Joi.object({
  user_id_token: Joi.string().min(11).max(11).required(),
  user_id: Joi.string().min(11).max(11).required(),
  username: Joi.string().min(3).max(15).optional(),
  password: Joi.string().min(3).max(64).optional(),
  name: Joi.string().max(60).optional(),
  user_phone: Joi.string()
    .min(11)
    .max(13)
    .pattern(/^[0-9]+$/)
    .optional(),
});

const deleteUsersValidation = Joi.object({
  user_id_token: Joi.string().min(11).max(11).required(),
  user_id: Joi.string().min(11).max(11).required(),
});
export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  createUserValidation,
  updateUsersValidation,
  deleteUsersValidation,
  getUserIdValidation,
  getDataUserValidation
};
