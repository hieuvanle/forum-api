const joi = require("@hapi/joi");

const bodyValidator = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value.body) req.value.body = {};
      req.value.body = result.value;
      next();
    }
  };
};

const paramsValidator = (schema, name) => {
  return (req, res, next) => {
    const result = schema.validate({ params: req.params[name] });
    if (result.error) {
      return res.status(400).json(result.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value.params) req.value.params = {};
      req.value.params[name] = result.value.params;
      next();
    }
  };
};

const schemas = {
  idSchema: joi.object().keys({
    params: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  userSchema: joi.object().keys({
    name: joi.string().min(4).max(12).required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi.string().min(6).max(12).required(),
  }),
  optionalUserSchema: joi.object().keys({
    name: joi.string().min(4).max(12),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi.string().min(6).max(12),
  }),
  postSchema: joi.object().keys({
    author: joi.string(),
    title: joi.string().required(),
    content: joi.string().required(),
  }),
  loginSchema: joi.object().keys({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi.string().min(6).max(12).required(),
  }),
};

module.exports = {
  bodyValidator,
  paramsValidator,
  schemas,
};
