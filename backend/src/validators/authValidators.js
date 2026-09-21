const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(190).required(),
  password: Joi.string().min(6).max(100).required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).max(100).required(),
  newPassword: Joi.string().min(8).max(100).required(),
});

module.exports = { loginSchema, changePasswordSchema };
