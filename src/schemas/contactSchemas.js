import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(3).max(20).required(),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().min(3).max(20),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
}).min(1);

export { createContactSchema, updateContactSchema };
