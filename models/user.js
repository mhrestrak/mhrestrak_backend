const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");


function model(data) {
  let array = [
    { key: "_id", value: data._id, type: "VarChar" },
    { key: "firstName", value: data.firstName, type: "VarChar" },
    { key: "lastName", value: data.lastName, type: "VarChar" },
    { key: "pass", value: data.pass, type: "VarChar" },
    { key: "email", value: data.email, type: "VarChar" },
    { key: "Center", value: data.Center, type: "VarChar" },
    { key: "isAdmin", value: data.isAdmin, type: "Bit" },
    { key: "isIntakeCoordinator", value: data.isIntakeCoordinator, type: "Bit" },
    { key: "isHouseManager", value: data.isHouseManager, type: "Bit" },
    { key: "isCaseCoordinator", value: data.isCaseCoordinator, type: "Bit" },
    { key: "isCenterCoordinator", value: data.isCenterCoordinator, type: "Bit" },
    { key: "invitePending", value: data.invitePending, type: "Bit" },
    { key: "isActive", value: data.isActive, type: "Bit" },
  ];
  return array.filter((Item) => Item.value !== undefined);
}

function token(user) {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isIntakeCoordinator: user.isIntakeCoordinator,
      isHouseManager: user.isHouseManager,
      isCaseCoordinator: user.isCaseCoordinator,
      isCenterCoordinator: user.isCenterCoordinator,
      invitePending: user.invitePending,
      isActive: user.isActive,
      Center: user.Center,
    },
    config.get("jwtPrivateKey")
  );
}

function validate(req) {
  const schema = Joi.object({
    firstName: Joi.string().required().max(50).min(5),
    lastName: Joi.string().required().max(50).min(5),
    email: Joi.string().required().max(255).email().min(5),
    pass: Joi.string().required().min(5).max(255),
    isAdmin: Joi.boolean(),
    isIntakeCoordinator: Joi.boolean(),
    isHouseManager : Joi.boolean(),
    isCaseCoordinator : Joi.boolean(),
    isCenterCoordinator : Joi.boolean(),
    invitePending : Joi.boolean(),
    isActive : Joi.boolean(),
    Center: Joi.string().required().max(50).min(5),
  });
  return schema.validate(req);
}

exports.userToken = token;
exports.validate = validate;
exports.model = model;

// const userSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 50,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     minlength: 5,
//     maxlength: 255,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 1024,
//   },
//   isAdmin: Boolean,
//   isIntakeCoordinator: Boolean,
// });
