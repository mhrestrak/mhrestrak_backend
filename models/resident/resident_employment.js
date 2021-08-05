const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    JobTitle: Joi.string().required().max(30),
    Industry: Joi.string().max(30),
    Skill: Joi.string().max(50),
    BusinessName: Joi.string().required().max(50),
    EmployerContactID: Joi.string(),
    WorkHours: Joi.number(),
    EmploymentNoteID: Joi.string(),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
