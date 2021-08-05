const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    Illness: Joi.string().max(1024),
    Allergy: Joi.string(),
    DoctorContactID: Joi.string().max(1024),
    MedicationId: Joi.string().max(1024),
    MedicalRestrictions: Joi.string().max(1024),
    DoctorContactID: Joi.string().max(50),
    DentistContactID: Joi.string().max(50),
    OpticialContactID: Joi.string().max(50),
    TherapistContactID: Joi.string().max(50),
    CounselorContactID: Joi.string().max(50),
    MedicalNoteID: Joi.string().max(50),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
