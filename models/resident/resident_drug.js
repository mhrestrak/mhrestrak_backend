const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    DrugOfChoice: Joi.string().required().max(30),
    LastDateOfUse: Joi.date().required(),
    MethodOfUse: Joi.string().max(30),
    UseComment: Joi.string().max(50),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
