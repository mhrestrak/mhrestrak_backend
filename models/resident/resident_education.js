const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "EducationLevel", value: data.EducationLevel, type: "VarChar" },
    { key: "EducationName", value: data.EducationName, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    EducationLevel: Joi.string().required().max(30),
    EducationName: Joi.string().required().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
