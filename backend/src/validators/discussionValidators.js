const Joi = require("joi");

const listDiscussionsQuerySchema = Joi.object({
  name: Joi.string().trim().max(150).allow(""),
  email: Joi.string().trim().max(190).allow(""),
  phone: Joi.string().trim().max(30).allow(""),
  theme_id: Joi.number().integer().positive(),
  date_from: Joi.date().iso(),
  date_to: Joi.date().iso(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { listDiscussionsQuerySchema };
