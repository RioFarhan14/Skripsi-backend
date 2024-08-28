import Joi from "joi";

const getHelpValidation = Joi.string().length(11).required();

const createHelpValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  title: Joi.string().max(60).required(),
  message: Joi.string().max(225).required(),
});

const updateHelpValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  help_id: Joi.number().required(),
  title: Joi.string().max(60).optional(),
  message: Joi.string().max(225).optional(),
});

const deleteHelpValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  help_id: Joi.number().required(),
});

export {
  createHelpValidation,
  updateHelpValidation,
  deleteHelpValidation,
  getHelpValidation,
};
