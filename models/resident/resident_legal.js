const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "AdmissionID", value: data.AdmissionID, type: "VarChar" },
    { key: "LegalCaseID", value: data.LegalCaseID, type: "VarChar" },
    { key: "CaseNumber", value: data.CaseNumber, type: "VarChar" },
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
    { key: "ProbationOfficer", value: data.ProbationOfficer, type: "VarChar" },
    { key: "Contact", value: data.Contact, type: "VarChar" },
    { key: "ProbationCounty", value: data.ParoleCounty, type: "VarChar" },
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
    { key: "WarrantCounty", value: data.WarrantCounty, type: "VarChar" },
    { key: "WarrantState", value: data.WarrantState, type: "VarChar" },
    { key: "ParoleState", value: data.ParoleState, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    AdmissionID: Joi.string(),
    LegalCaseID: Joi.string().max(30),
    CaseNumber: Joi.string().max(30),
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
    ProbationOfficer : Joi.string(),
    Contact : Joi.string(),
    ProbationCounty: Joi.string().max(50),
    CommunityServiceRqd: Joi.boolean(),
    RestitutionFinesRqd: Joi.boolean(),
    NeedCourtApproval: Joi.boolean(),
    ActiveWarrant: Joi.boolean(),
    WarrantDate: Joi.date().allow(null),
    WarrantCounty: Joi.string().max(50),
    WarrantState: Joi.string().max(50),
    ParoleState: Joi.string().max(50),
  });
  return schema.validate(req.body);
}
exports.model = model;
exports.validate = validate;
