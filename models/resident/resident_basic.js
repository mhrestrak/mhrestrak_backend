const Joi = require("joi");

function validate(req) {
  const schema = {
    SSN: Joi.string().required().max(12),
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
    IsChurchAttender: Joi.boolean(),
    AcceptedJesus: Joi.boolean(),
    ChurchName: Joi.string().max(30),
    ChurchLocation: Joi.string().max(30),
    ChurchPhone: Joi.string().max(15),
    RecentPhase: Joi.string().max(30),
    RecentAdmissionID: Joi.string().max(30),
    LastMHMEnteryDate: Joi.date(),
    LastMHMExitDate: Joi.date(),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
