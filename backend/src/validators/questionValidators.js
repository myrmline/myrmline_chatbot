const Joi = require("joi");

const createQuestionSchema = Joi.object({
  theme_id: Joi.number().integer().positive().required(),
  question: Joi.string().trim().min(3).max(1000).required(),
  answer: Joi.string().trim().min(3).max(3000).required(),
  is_active: Joi.boolean().default(true),
});

const updateQuestionSchema = Joi.object({
  theme_id: Joi.number().integer().positive(),
  question: Joi.string().trim().min(3).max(1000),
  answer: Joi.string().trim().min(3).max(3000),
  is_active: Joi.boolean(),
}).min(1);

const listQuestionsQuerySchema = Joi.object({
  theme_id: Joi.number().integer().positive(),
  search: Joi.string().trim().max(200).allow(""),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(200).default(20),
});

module.exports = { createQuestionSchema, updateQuestionSchema, listQuestionsQuerySchema };
