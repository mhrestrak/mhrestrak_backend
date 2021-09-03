const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

function token(user) {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isIntakeCoordinator: user.isIntakeCoordinator,
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
    Center: Joi.string().required().max(50).min(5),
  });
  return schema.validate(req);
}

exports.userToken = token;
exports.validate = validate;

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
