const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "EducationLevel", value: data.EducationLevel, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    EducationLevel: Joi.string().required().max(30),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
