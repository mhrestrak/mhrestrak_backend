const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    ContactTypeId: Joi.string().required(),
    ContactFirstName: Joi.string().required().max(30),
    ContactLastName: Joi.string().required().max(30),
    Email: Joi.string().max(60),
    Phone: Joi.string().required().max(15),
    Address: Joi.string().max(50),
    Fax: Joi.string().max(50),
    City: Joi.string().max(30),
    State: Joi.string().max(2),
    ZipCode: Joi.string().max(10),
    ContactNoteID: Joi.string(),
    EmergencyRelationship: Joi.string().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
