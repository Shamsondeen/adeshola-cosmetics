const Joi = require ('joi');

exports.validateAdminRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    phone: Joi.string().required().pattern(/^\+?[\d\s-]{10,15}$/)
  });

  return schema.validate(data);
};