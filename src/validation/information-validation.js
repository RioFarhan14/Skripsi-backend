import Joi from "joi";

const getCardInformationValidation = Joi.object({
  user_id: Joi.string().length(11).required(),
  type: Joi.string().required(),
});

export { getCardInformationValidation };