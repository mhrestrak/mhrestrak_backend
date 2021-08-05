const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    DebtName: Joi.string().max(30),
    DebtTypeListId: Joi.string().max(30).required(),
    DebtAmount: Joi.number(),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
