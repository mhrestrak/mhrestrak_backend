const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "DebtName", value: data.DebtName, type: "VarChar" },
    { key: "DebtTypeListId", value: data.DebtTypeListId, type: "VarChar" },
    { key: "DebtAmount", value: data.DebtAmount, type: "Int" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}
function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    DebtName: Joi.string().max(30),
    DebtTypeListId: Joi.string().max(30).required(),
    DebtAmount: Joi.number(),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
