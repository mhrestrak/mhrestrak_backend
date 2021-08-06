const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "ContactTypeId", value: data.ContactTypeId, type: "VarChar" },
    { key: "ContactFirstName", value: data.ContactFirstName, type: "VarChar" },
    { key: "ContactLastName", value: data.ContactLastName, type: "VarChar" },
    { key: "Email", value: data.Email, type: "VarChar" },
    { key: "Phone", value: data.Phone, type: "VarChar" },
    { key: "Address", value: data.Address, type: "VarChar" },
    { key: "Fax", value: data.Fax, type: "VarChar" },
    { key: "City", value: data.City, type: "VarChar" },
    { key: "State", value: data.State, type: "VarChar" },
    { key: "ZipCode", value: data.ZipCode, type: "VarChar" },
    { key: "ContactNoteID", value: data.ContactNoteID, type: "VarChar" },
    {
      key: "EmergencyRelationship",
      value: data.EmergencyRelationship,
      type: "VarChar",
    },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    ContactTypeId: Joi.string().required(),
    ContactFirstName: Joi.string().required().max(30),
    ContactLastName: Joi.string().required().max(30),
    Email: Joi.string().max(60),
    Phone: Joi.string().required().max(15),
    Address: Joi.string().max(50),
    Fax: Joi.string().max(50),
    City: Joi.string().max(30),
    State: Joi.string().max(2),
    ZipCode: Joi.string().max(10),
    ContactNoteID: Joi.string(),
    EmergencyRelationship: Joi.string().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
