const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "AdmissionID", value: data.AdmissionID, type: "VarChar" },
    { key: "GuestInDate", value: data.GuestInDate, type: "Date" },
    {
      key: "TreatmentCenterListID",
      value: data.TreatmentCenterListID,
      type: "VarChar",
    },
    { key: "WasHomeless", value: data.WasHomeless, type: "Bit" },
    { key: "WasJobless", value: data.WasJobless, type: "Bit" },
    {
      key: "WasDomesticallyAbused",
      value: data.WasDomesticallyAbused,
      type: "Bit",
    },
    {
      key: "HasMentalHealthChallanges",
      value: data.HasMentalHealthChallanges,
      type: "Bit",
    },
    { key: "ProgramInDate", value: data.ProgramInDate, type: "Date" },
    { key: "RoomNum", value: data.RoomNum, type: "Int" },
    {
      key: "ReferredByContactID",
      value: data.ReferredByContactID,
      type: "VarChar",
    },
    { key: "EstMoveOutDate", value: data.EstMoveOutDate, type: "Date" },
    { key: "IsRestricted", value: data.IsRestricted, type: "Bit" },
    { key: "IsApprovedPartner", value: data.IsApprovedPartner, type: "Bit" },
    {
      key: "IsApprovedBabySitter",
      value: data.IsApprovedBabySitter,
      type: "Bit",
    },
    { key: "CanSelfSignout", value: data.CanSelfSignout, type: "Bit" },
    { key: "AdmissionNotesID", value: data.AdmissionNotesID, type: "VarChar" },
    { key: "CaseWorkerName", value: data.CaseWorkerName, type: "VarChar" },
    {
      key: "IntakeCoordinatorName",
      value: data.IntakeCoordinatorName,
      type: "VarChar",
    },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ResID: Joi.string().required(),
    AdmissionID: Joi.string().required().max(30),
    GuestInDate: Joi.date().required(),
    TreatmentCenterListID: Joi.string().max(30),
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
    RecentPhase : Joi.string().max(30),
    CanSelfSignout: Joi.boolean(),
    AdmissionNotesID: Joi.boolean(),
    CaseWorkerName: Joi.string().max(30),
    IntakeCoordinatorName: Joi.string().required().max(30),
  });
  return schema.validate(req.body);
}
exports.model = model;
exports.validate = validate;
