const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "PartnerContactID", value: data.PartnerContactID, type: "VarChar" },
    { key: "ChildDob", value: data.ChildDob, type: "Date" },
    { key: "ChildInHouseFlag", value: data.ChildInHouseFlag, type: "Bit" },
    { key: "HasChildSupport", value: data.HasChildSupport, type: "Bit" },
    { key: "PaysChildSupport", value: data.PaysChildSupport, type: "Bit" },
    { key: "ChildSupportAmount", value: data.ChildSupportAmount, type: "Int" },
    { key: "IsPregnant", value: data.IsPregnant, type: "Bit" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    // PartnerContactID: Joi.string().required().max(30),
    PartnerContactID: Joi.string().max(30),
    ChildDob: Joi.date(),
    ChildInHouseFlag: Joi.boolean(),
    HasChildSupport: Joi.boolean(),
    PaysChildSupport: Joi.boolean(),
    ChildSupportAmount: Joi.number().max(30),
    IsPregnant: Joi.boolean(),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
