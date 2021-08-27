const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "DebtName", value: data.DebtName, type: "VarChar" },
    { key: "DebtTypeListId", value: data.DebtTypeListId, type: "VarChar" },
    { key: "DebtAmount", value: data.DebtAmount, type: "Int" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}
function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    DebtName: Joi.string().max(30),
    DebtTypeListId: Joi.string().max(30).required(),
    DebtAmount: Joi.number(),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
