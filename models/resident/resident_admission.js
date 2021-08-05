const Joi = require("joi");

function validate(req) {
  const schema = {
    ResID: Joi.string().required(),
    AdmissionID: Joi.string().required().max(30),
    GuestInDate: Joi.date().required(),
    TreatmentCenterListID: Joi.string().required().max(30),
    WasHomeless: Joi.boolean(),
    WasJobless: Joi.boolean(),
    WasDomesticallyAbused: Joi.boolean(),
    HasMentalHealthChallanges: Joi.boolean(),
    ProgramInDate: Joi.date().required(),
    RoomNum: Joi.number(),
    ReferredByContactID: Joi.string().max(30),
    EstMoveOutDate: Joi.date(),
    IsRestricted: Joi.boolean(),
    IsApprovedPartner: Joi.boolean(),
    IsApprovedBabySitter: Joi.boolean(),
    CanSelfSignout: Joi.boolean(),
    AdmissionNotesID: Joi.boolean(),
    CaseWorkerName: Joi.string().max(30),
    IntakeCoordinatorName: Joi.Joi.string().required().max(30),
  };
  return Joi.validate(req.body, schema);
}

exports.validate = validate;
