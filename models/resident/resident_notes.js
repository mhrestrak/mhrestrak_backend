const Joi = require("joi");

function model(data) {
  let array = [
    { key: "ID", value: data.ID, type: "VarChar" },
    { key: "ResID", value: data.ResID, type: "VarChar" },
    { key: "AdmissionID", value: data.AdmissionID, type: "VarChar" },
    {
      key: "NoteCategoryListID",
      value: data.NoteCategoryListID,
      type: "VarChar",
    },
    { key: "NoteSessionID", value: data.NoteSessionID, type: "VarChar" },
    { key: "NoteDateTime", value: data.NoteDateTime, type: "DateTime" },
    { key: "NoteSubject", value: data.NoteSubject, type: "VarChar" },
    { key: "Note", value: data.Note, type: "VarChar" },
    { key: "NoteByUID", value: data.NoteByUID, type: "VarChar" },
    { key: "NoteByName", value: data.NoteByName, type: "VarChar" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function validate(req) {
  const schema = Joi.object({
    ID: Joi.string(),
    ResID: Joi.string().required(),
    AdmissionID: Joi.string(),
    NoteCategoryListID: Joi.string().required().max(30),
    NoteSessionID: Joi.string().max(30),
    NoteDateTime: Joi.date().required(),
    NoteSubject: Joi.string().max(50),
    Note: Joi.string().required(),
    NoteByUID: Joi.string(),
    NoteByName: Joi.string(),
  });
  return schema.validate(req.body);
}

exports.model = model;
exports.validate = validate;
