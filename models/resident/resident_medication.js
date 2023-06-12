const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    {
      key: "PrescriberContactId",
      value: data.PrescriberContactId,
      type: "VarChar",
    },
    {
      key: "PrescriberBusinessName",
      value: data.PrescriberBusinessName,
      type: "VarChar",
    },
    { key: "InsuranceName", value: data.InsuranceName, type: "VarChar" },
    { key: "StartDate", value: data.StartDate, type: "DateTime" },
    { key: "EndDate", value: data.EndDate, type: "DateTime" },
    { key: "TimesPerDay", value: data.TimesPerDay, type: "VarChar" },
    { key: "Dosage", value: data.Dosage, type: "VarChar" },
    { key: "MedicationNoteID", value: data.MedicationNoteID, type: "VarChar" },
    {
      key: "MedicationName",
      value: data.MedicationName,
      type: "VarChar",
    },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    PrescriberContactId: Joi.string().max(15),
    PrescriberBusinessName: Joi.string().max(50),
    InsuranceName: Joi.string().max(50),
    StartDate: Joi.date().allow(null),
    EndDate: Joi.date().allow(null),
    TimesPerDay: Joi.string().max(50),
    Dosage: Joi.string().max(50),
    MedicationNoteID: Joi.string().max(50),
    MedicationName: Joi.string().required().max(30),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
