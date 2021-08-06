const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "DrugOfChoice", value: data.DrugOfChoice, type: "VarChar" },
    { key: "LastDateOfUse", value: data.LastDateOfUse, type: "Date" },
    { key: "MethodOfUse", value: data.MethodOfUse, type: "VarChar" },
    { key: "UseComment", value: data.UseComment, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    DrugOfChoice: Joi.string().required().max(30),
    LastDateOfUse: Joi.date().required(),
    MethodOfUse: Joi.string().max(30),
    UseComment: Joi.string().max(50),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
