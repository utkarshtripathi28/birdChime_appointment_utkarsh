const Joi = require("joi");
const appointmentSchema = Joi.object({
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(""),
  reason: Joi.string().max(200).optional().allow(""),
});
module.exports = appointmentSchema;
