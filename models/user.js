// const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

function token(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      isIntakeCoordinator: user.isIntakeCoordinator,
    },
    config.get("jwtPrivateKey")
  );
}

function validate(req) {
  return Joi.validate(req, {
    name: Joi.string().required().max(50).min(5),
    email: Joi.string().required().max(255).email().min(5),
    password: Joi.string().required().min(5).max(255),
    isAdmin: Joi.boolean(),
    isIntakeCoordinator: Joi.boolean(),
  });
}

exports.userToken = token;
exports.userValidation = validate;

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
