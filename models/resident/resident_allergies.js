const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "Condition", value: data.Condition, type: "VarChar" },
    { key: "Description", value: data.Description, type: "VarChar" },
    { key: "Seasonal", value: data.Seasonal, type: "Bit"},
    { key: "AdmissionID", value: data.AdmissionID, type: "VarChar" }
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    Condition: Joi.string().required(),
    Description: Joi.string(),
    Seasonal: Joi.string(),
    AdmissionID : Joi.string()
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
