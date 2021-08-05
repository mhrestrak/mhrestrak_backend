const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    PrescriberContactId: Joi.string().max(15),
    PrescriberBusinessName: Joi.string().max(50),
    InsuranceName: Joi.string().max(50),
    StartDate: Joi.date(),
    EndDate: Joi.date().required(),
    TimesPerDay: Joi.number().max(20).required(),
    Dosage: Joi.string().max(50),
    MedicationNoteID: Joi.string().max(50),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
