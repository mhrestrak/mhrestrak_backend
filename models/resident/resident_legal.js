const Joi = require("joi");

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
