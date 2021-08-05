const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    PartnerContactID: Joi.string().required().max(30),
    ChildDob: Joi.date(),
    ChildInHouseFlag: Joi.boolean(),
    HasChildSupport: Joi.boolean(),
    PaysChildSupport: Joi.boolean(),
    ChildSupportAmount: Joi.number().max(30),
    IsPregnant: Joi.boolean(),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
