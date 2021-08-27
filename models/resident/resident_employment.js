const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "JobTitle", value: data.JobTitle, type: "VarChar" },
    { key: "Industry", value: data.Industry, type: "VarChar" },
    { key: "Skill", value: data.Skill, type: "VarChar" },
    { key: "BusinessName", value: data.BusinessName, type: "VarChar" },
    {
      key: "EmployerContactID",
      value: data.EmployerContactID,
      type: "VarChar",
    },
    { key: "WorkHours", value: data.WorkHours, type: "Int" },
    { key: "EmploymentNoteID", value: data.EmploymentNoteID, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    JobTitle: Joi.string().required().max(30),
    Industry: Joi.string().max(30),
    Skill: Joi.string().max(50),
    BusinessName: Joi.string().required().max(50),
    EmployerContactID: Joi.string(),
    WorkHours: Joi.number(),
    EmploymentNoteID: Joi.string(),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
