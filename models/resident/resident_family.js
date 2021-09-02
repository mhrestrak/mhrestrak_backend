const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "PartnerContactID", value: data.PartnerContactID, type: "VarChar" },
    { key: "PartnerName", value: data.PartnerName, type: "VarChar" },
    {
      key: "ChildName",
      value: data.ChildName,
      type: "VarChar",
    },
    { key: "ChildDob", value: data.ChildDob, type: "Date" },
    { key: "ChildInHouseFlag", value: data.ChildInHouseFlag, type: "Bit" },
    { key: "HasChildSupport", value: data.HasChildSupport, type: "Bit" },
    { key: "PaysChildSupport", value: data.PaysChildSupport, type: "Bit" },
    { key: "ChildSupportAmount", value: data.ChildSupportAmount, type: "Int" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    PartnerContactID: Joi.string().max(30),
    PartnerName: Joi.string().max(50),
    ChildDob: Joi.date(),
    ChildInHouseFlag: Joi.boolean(),
    HasChildSupport: Joi.boolean(),
    PaysChildSupport: Joi.boolean(),
    ChildSupportAmount: Joi.number(),
    ChildName: Joi.string().max(30),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
