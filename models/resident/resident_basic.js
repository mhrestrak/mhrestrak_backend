const Joi = require("joi");

function model(data) {
  let array = [
    { key: "SSN", value: data.SSN, type: "NVarChar" },
    { key: "ResPictureKey", value: data.ResPictureKey, type: "VarChar" },
    { key: "MaxisID", value: data.MaxisID, type: "VarChar" },
    { key: "PSNumber", value: data.PSNumber, type: "VarChar" },
    { key: "ResFirstName", value: data.ResFirstName, type: "VarChar" },
    { key: "ResMiddleName", value: data.ResMiddleName, type: "VarChar" },
    { key: "ResLastName", value: data.ResLastName, type: "VarChar" },
    { key: "ResEmailAddr", value: data.ResEmailAddr, type: "VarChar" },
    { key: "ResBirthDate", value: data.ResBirthDate, type: "Date" },
    { key: "ResPhoneNumber", value: data.ResPhoneNumber, type: "Int" },
    { key: "WhereRaisedCity", value: data.WhereRaisedCity, type: "VarChar" },
    { key: "WhereRaisedState", value: data.WhereRaisedState, type: "VarChar" },
    {
      key: "WhereRaisedCountry",
      value: data.WhereRaisedCountry,
      type: "VarChar",
    },
    { key: "ResAddress1", value: data.ResAddress1, type: "VarChar" },
    { key: "ResCity", value: data.ResCity, type: "VarChar" },
    { key: "ResCounty", value: data.ResCounty, type: "VarChar" },
    { key: "ResState", value: data.ResState, type: "VarChar" },
    { key: "ResZipCode", value: data.ResZipCode, type: "VarChar" },
    { key: "IsVeteran", value: data.IsVeteran, type: "" },
    { key: "RaceListID", value: data.RaceListID, type: "VarChar" },
    {
      key: "MaritalStatusListID",
      value: data.MaritalStatusListID,
      type: "VarChar",
    },
    { key: "HasChildren", value: data.HasChildren, type: "Bit" },
    { key: "IsChurchAttender", value: data.IsChurchAttender, type: "Bit" },
    { key: "AcceptedJesus", value: data.AcceptedJesus, type: "Bit" },
    { key: "ChurchName", value: data.ChurchName, type: "VarChar" },
    { key: "ChurchLocation", value: data.ChurchLocation, type: "VarChar" },
    { key: "ChurchPhone", value: data.ChurchPhone, type: "VarChar" },
    { key: "RecentPhase", value: data.RecentPhase, type: "VarChar" },
    {
      key: "RecentAdmissionID",
      value: data.RecentAdmissionID,
      type: "VarChar",
    },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    SSN: Joi.string().required().max(12),
    ResPictureKey: Joi.string(),
    MaxisID: Joi.string().required().max(12),
    PSNumber: Joi.string().required().max(12),
    IsActive: Joi.boolean(),
    ResFirstName: Joi.string().required().max(30),
    ResMiddleName: Joi.string().required().max(30),
    ResLastName: Joi.string().required().max(30),
    ResEmailAddr: Joi.string().required().max(60),
    ResBirthDate: Joi.date().required(),
    ResPhoneNumber: Joi.number(),
    WhereRaisedCity: Joi.string().required().max(50),
    WhereRaisedState: Joi.string().required().max(50),
    WhereRaisedCountry: Joi.string().required().max(50),
    ResAddress1: Joi.string().max(50),
    ResCity: Joi.string().max(30),
    ResCounty: Joi.string().max(30),
    ResState: Joi.string().max(2),
    ResZipCode: Joi.string().max(10),
    IsVeteran: Joi.boolean(),
    RaceListID: Joi.string(),
    MaritalStatusListID: Joi.string(),
    HasChildren: Joi.boolean(),
    IsChurchAttender: Joi.boolean(),
    AcceptedJesus: Joi.boolean(),
    ChurchName: Joi.string().max(30),
    ChurchLocation: Joi.string().max(30),
    ChurchPhone: Joi.string().max(15),
    RecentPhase: Joi.string().max(30),
    RecentAdmissionID: Joi.string().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.model = model;
exports.validate = validate;
