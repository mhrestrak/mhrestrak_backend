const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    EducationLevel: Joi.string().required().max(30),
    EducationName: Joi.string().required().max(30),
    EducationNoteID: Joi.string().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
