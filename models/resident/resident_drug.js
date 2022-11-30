const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "DrugOfChoice", value: data.DrugOfChoice, type: "VarChar" },
    { key: "LastDateOfUse", value: data.LastDateOfUse, type: "Date" },
    { key: "MethodOfUse", value: data.MethodOfUse, type: "VarChar" },
    { key: "UseComment", value: data.UseComment, type: "VarChar" },
    {
      key: "PrimaryDrugOfChoice",
      value: data.PrimaryDrugOfChoice,
      type: "Bit",
    },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    DrugOfChoice: Joi.string().required().max(30),
    LastDateOfUse: Joi.date(),
    MethodOfUse: Joi.string().max(30),
    UseComment: Joi.string().max(50),
    PrimaryDrugOfChoice: Joi.boolean(),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
