const Joi = require("joi");

// Validation souple mais sûre du numéro de téléphone (chiffres, espaces, +, -, parenthèses)
const phonePattern = /^[0-9+()\-.\s]{6,30}$/;

const startDiscussionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(190).required(),
  phone: Joi.string().trim().pattern(phonePattern).required().messages({
    "string.pattern.base": '"phone" doit être un numéro de téléphone valide.',
  }),
  theme_id: Joi.number().integer().positive().required(),
});

const postMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required(),
});

module.exports = { startDiscussionSchema, postMessageSchema };
