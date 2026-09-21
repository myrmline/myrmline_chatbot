const Joi = require("joi");

const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(190).required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid("super_admin", "admin").default("admin"),
});

const updateAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(190),
  role: Joi.string().valid("super_admin", "admin"),
  is_active: Joi.boolean(),
  password: Joi.string().min(8).max(100).allow("", null),
}).min(1);

module.exports = { createAdminSchema, updateAdminSchema };
