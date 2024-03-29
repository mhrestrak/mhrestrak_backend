const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "PhaseData", value: data.PhaseData, type: "VarChar" },
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
    { key: "RoomNum", value: data.RoomNum, type: "VarChar" },
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
    {
      key: "WhoReferred",
      value: data.WhoReferred,
      type: "VarChar",
    },
    {
      key: "ReasonForLeaving",
      value: data.ReasonForLeaving,
      type: "VarChar",
    },
    { key: "DateOut", value: data.DateOut, type: "Date" },
    { key: "PossessionsRemovedDate", value: data.PossessionsRemovedDate, type: "Date" },
    {
      key: "DischargeLocation",
      value: data.DischargeLocation,
      type: "VarChar",
    },
    { key: "BlockFromReentry", value: data.BlockFromReentry, type: "Bit" },
    { key: "LeftVolunteerly", value: data.LeftVolunteerly, type: "Bit" },
    {
      key: "UnresolvedIssues",
      value: data.UnresolvedIssues,
      type: "VarChar",
    },
    {
      key: "ReadmitConditions",
      value: data.ReadmitConditions,
      type: "VarChar",
    },
    {
      key: "ExitNotes",
      value: data.ExitNotes,
      type: "VarChar",
    },
    {
      key: "TimesCompletedTreatment",
      value: data.TimesCompletedTreatment,
      type: "VarChar"
    },
    {
      key: "PreviousInpatientAttempts",
      value: data.PreviousInpatientAttempts,
      type: "VarChar"
    },
    { key: "HasMobile", value: data.HasMobile, type: "Bit" },
    { key: "HasTablet", value: data.HasTablet, type: "Bit" },
    { key: "CheckedInMobile", value: data.CheckedInMobile, type: "Bit" },
    { key: "CheckedInTablet", value: data.CheckedInTablet, type: "Bit" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ResID: Joi.string().required(),
    PhaseData : Joi.string().optional().allow(""),
    AdmissionID: Joi.string().max(30),
    GuestInDate: Joi.date().allow(null),
    TreatmentCenterListID: Joi.string().max(30).optional().allow(""),
    WasHomeless: Joi.boolean(),
    WasJobless: Joi.boolean(),
    WasDomesticallyAbused: Joi.boolean(),
    HasMentalHealthChallanges: Joi.boolean(),
    ProgramInDate: Joi.date().allow(null),
    RoomNum: Joi.string().max(30),
    ReferredByContactID: Joi.string().max(30),
    EstMoveOutDate: Joi.date().allow(null),
    IsRestricted: Joi.boolean(),
    IsApprovedPartner: Joi.boolean(),
    IsApprovedBabySitter: Joi.boolean(),
    RecentPhase : Joi.string().max(30),
    CanSelfSignout: Joi.boolean(),
    AdmissionNotesID: Joi.boolean(),
    CaseWorkerName: Joi.string().max(30),
    IntakeCoordinatorName: Joi.string().max(30),
    
    WhoReferred : Joi.string().max(50).optional().allow(""),
    WhoReferredRelationship : Joi.string().max(50).optional().allow(""),
    ReasonForLeaving : Joi.string().max(30),
    DateOut: Joi.date().allow(null),
    PossessionsRemovedDate: Joi.date().allow(null),
    DischargeLocation : Joi.string().max(30),
    BlockFromReentry: Joi.boolean(),
    LeftVolunteerly: Joi.boolean(),
    UnresolvedIssues : Joi.string().max(200),
    ReadmitConditions : Joi.string().max(200),
    ExitNotes : Joi.string().max(200),
    TimesCompletedTreatment : Joi.string(),
    PreviousInpatientAttempts:  Joi.string(),

    DisciplinaryPoints : Joi.string().optional().allow(""),
    HasMobile : Joi.boolean(),
    HasTablet : Joi.boolean(),
    CheckedInMobile : Joi.boolean(),
    CheckedInTablet : Joi.boolean(),
  });
  return schema.validate(req.body);
}
exports.model = model;
exports.validate = validate;
