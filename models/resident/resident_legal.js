const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "AdmissionID", value: data.AdmissionID, type: "VarChar" },
    { key: "LegalCaseID", value: data.LegalCaseID, type: "VarChar" },
    { key: "CaseNumber", value: data.CaseNumber, type: "Int" },
    { key: "ChargesSummary", value: data.ChargesSummary, type: "VarChar" },
    { key: "ChargeLevel", value: data.ChargeLevel, type: "VarChar" },
    { key: "CaseName", value: data.CaseName, type: "VarChar" },
    { key: "CaseCounty", value: data.CaseCounty, type: "VarChar" },
    {
      key: "CaseWorkerContactID",
      value: data.CaseWorkerContactID,
      type: "VarChar",
    },
    {
      key: "AttorneyContactID",
      value: data.AttorneyContactID,
      type: "VarChar",
    },
    { key: "POContactID", value: data.POContactID, type: "VarChar" },
    { key: "OTherContactID", value: data.OTherContactID, type: "VarChar" },
    { key: "OTherContactID1", value: data.OTherContactID1, type: "VarChar" },
    { key: "OTherContactID12", value: data.OTherContactID12, type: "VarChar" },
    { key: "CivilSuit", value: data.CivilSuit, type: "Bit" },
    { key: "CustodySuit", value: data.CustodySuit, type: "Bit" },
    { key: "OnProbation", value: data.OnProbation, type: "Bit" },
    { key: "ParoleCounty", value: data.ParoleCounty, type: "VarChar" },
    {
      key: "CommunityServiceRqd",
      value: data.CommunityServiceRqd,
      type: "Bit",
    },
    {
      key: "RestitutionFinesRqd",
      value: data.RestitutionFinesRqd,
      type: "Bit",
    },
    { key: "NeedCourtApproval", value: data.NeedCourtApproval, type: "Bit" },
    { key: "ActiveWarrant", value: data.ActiveWarrant, type: "Bit" },
    { key: "WarrantDate", value: data.WarrantDate, type: "Date" },
    { key: "WarrentCounty", value: data.WarrentCounty, type: "VarChar" },
    { key: "WarrentState", value: data.WarrentState, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    AdmissionID: Joi.string().required(),
    LegalCaseID: Joi.string().required().max(30),
    CaseNumber: Joi.string().required().max(30),
    ChargesSummary: Joi.string().max(50),
    ChargeLevel: Joi.string().max(30),
    CaseName: Joi.string().max(50),
    CaseCounty: Joi.string().max(50),
    CaseWorkerContactID: Joi.string().max(30),
    AttorneyContactID: Joi.string().max(50),
    POContactID: Joi.string().max(50),
    OTherContactID: Joi.string().max(50),
    OTherContactID1: Joi.string().max(50),
    OTherContactID12: Joi.string().max(50),
    CivilSuit: Joi.boolean(),
    CustodySuit: Joi.boolean(),
    OnProbation: Joi.boolean(),
    ParoleCounty: Joi.string().max(50),
    CommunityServiceRqd: Joi.boolean(),
    RestitutionFinesRqd: Joi.boolean(),
    NeedCourtApproval: Joi.boolean(),
    ActiveWarrant: Joi.boolean(),
    WarrantDate: Joi.date(),
    WarrentCounty: Joi.string().max(50),
    WarrentState: Joi.string().max(50),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
