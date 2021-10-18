const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "Illness", value: data.Illness, type: "VarChar" },
    { key: "Allergy", value: data.Allergy, type: "VarChar" },
    { key: "DoctorContactID", value: data.DoctorContactID, type: "VarChar" },
    { key: "MedicationId", value: data.MedicationId, type: "VarChar" },
    {
      key: "MedicalRestrictions",
      value: data.MedicalRestrictions,
      type: "VarChar",
    },
    { key: "DoctorContactID", value: data.DoctorContactID, type: "VarChar" },
    { key: "DentistContactID", value: data.DentistContactID, type: "VarChar" },
    {
      key: "OpticialContactID",
      value: data.OpticialContactID,
      type: "VarChar",
    },
    {
      key: "TherapistContactID",
      value: data.TherapistContactID,
      type: "VarChar",
    },
    {
      key: "CounselorContactID",
      value: data.CounselorContactID,
      type: "VarChar",
    },
    { key: "MedicalNoteID", value: data.MedicalNoteID, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
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
    Treatment: Joi.string().max(50),
    Condition: Joi.string().max(50),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
