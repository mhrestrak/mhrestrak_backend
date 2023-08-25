//@ts-ignore
const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "SSN", value: data.SSN, type: "NVarChar" },
    { key: "ResPictureKey", value: data.ResPictureKey, type: "VarChar" },
    { key: "MaxisID", value: data.MaxisID, type: "VarChar" },
    { key: "PSNumber", value: data.PSNumber, type: "VarChar" },
    { key: "ResFirstName", value: data.ResFirstName, type: "VarChar" },
    { key: "ResMiddleName", value: data.ResMiddleName, type: "VarChar" },
    { key: "ResLastName", value: data.ResLastName, type: "VarChar" },
    { key: "ResEmailAddr", value: data.ResEmailAddr, type: "VarChar" },
    { key: "ResBirthDate", value: data.ResBirthDate, type: "Date" },
    { key: "ResPhoneNumber", value: data.ResPhoneNumber, type: "VarChar" },
    { key: "WhereRaised", value: data.WhereRaised, type: "VarChar" },
    { key: "ResAddress1", value: data.ResAddress1, type: "VarChar" },
    { key: "ResCity", value: data.ResCity, type: "VarChar" },
    { key: "ResCounty", value: data.ResCounty, type: "VarChar" },
    { key: "ResState", value: data.ResState, type: "VarChar" },
    { key: "ResZipCode", value: data.ResZipCode, type: "VarChar" },
    { key: "IsVeteran", value: data.IsVeteran, type: "Bit" },
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
    { key: "IsPregnant", value: data.IsPregnant, type: "Bit" },
    { key: "IsActive", value: data.IsActive, type: "Bit" },
    { key: "RecentPhase", value: data.RecentPhase, type: "VarChar" },
    {
      key: "RecentAdmissionID",
      value: data.RecentAdmissionID,
      type: "VarChar",
    },
    { key: "AdmittedFrom", value: data.AdmittedFrom, type: "VarChar" },
    { key: "OnMA", value: data.OnMA, type: "Bit" },
    { key: "OnSSISSD", value: data.OnSSISSD, type: "Bit" },
    { key: "IsEmployed", value: data.IsEmployed, type: "Bit" },
    { key: "RoomNum", value: data.RoomNum, type: "VarChar" },
    { key: "Center", value: data.Center, type: "VarChar" }
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ResID: Joi.string().required(),
    SSN: Joi.string().required().max(12),
    ResPictureKey: Joi.string(),
    MaxisID: Joi.string().max(12),
    PSNumber: Joi.string().max(12),
    IsActive: Joi.boolean(),
    ResFirstName: Joi.string().required().max(30),
    ResMiddleName: Joi.string().max(30),
    ResLastName: Joi.string().required().max(30),
    ResEmailAddr: Joi.string().max(60),
    ResBirthDate: Joi.date().required(),
    ResPhoneNumber: Joi.string().max(30),
    WhereRaised: Joi.string().max(100),
    ResAddress1: Joi.string().max(50),
    ResCity: Joi.string().max(70),
    ResCounty: Joi.string().max(70),
    ResState: Joi.string().max(70),
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
    IsPregnant: Joi.boolean(),
    RecentPhase: Joi.string().max(30),
    RecentAdmissionID: Joi.string().max(30),
    AdmittedFrom: Joi.string().max(100),
    OnMA: Joi.boolean(),
    OnSSISSD: Joi.boolean(),
    IsEmployed: Joi.boolean(),
    RoomNum : Joi.string().max(30),
    Center :Joi.string().optional(),
  });
  return schema.validate(req.body);
}

function validateUpdate(req){
  const schema = Joi.object({
    SSN: Joi.string().required().max(12),
    ResFirstName: Joi.string().required().max(30),
    ResLastName: Joi.string().required().max(30),
    ResEmailAddr: Joi.string().max(60),
    ResPhoneNumber: Joi.string().max(30),
    IsChurchAttender: Joi.boolean(),
    IsPregnant: Joi.boolean(),
    IsEmployed: Joi.boolean(),
    // RoomNum : Joi.string().max(30).optional().allow(null),
    // RecentPhase : Joi.string().max(30)
  })
  return schema.validate({
    SSN: req.body["SSN"],
    ResFirstName: req.body["ResFirstName"],
    ResLastName: req.body["ResLastName"],
    ResEmailAddr: req.body["ResEmailAddr"],
    ResPhoneNumber: req.body["ResPhoneNumber"],
    IsChurchAttender: req.body["IsChurchAttender"],
    IsPregnant: req.body["IsPregnant"],
    IsEmployed: req.body["IsEmployed"],
    // RoomNum : req.body["RoomNum"],
    // RecentPhase : req.body["RecentPhase"]
  })
}
exports.model = model;
exports.validate = validate;
exports.validateUpdate = validateUpdate;
