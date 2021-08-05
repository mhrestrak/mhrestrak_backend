const Joi = require("joi");

function validate(req) {
  const schema = {
    AdmissionID: Joi.string(),
    NoteCategoryListID: Joi.string().required().max(30),
    NoteSessionID: Joi.string().max(30),
    NoteDateTime: Joi.date().required(),
    NoteSubject: Joi.string().max(50),
    Note: Joi.string().required(),
    NoteByUID: Joi.string(),
    NoteByName: Joi.string(),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
