const Joi = require("joi");

const createThemeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().max(2000).allow("", null),
  is_active: Joi.boolean().default(true),
});

const updateThemeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().max(2000).allow("", null),
  is_active: Joi.boolean(),
}).min(1);

module.exports = { createThemeSchema, updateThemeSchema };
