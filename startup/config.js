const config = require("config");
//------------------------Checking for Jwt PrivateKey-------------------
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROE: jwtPrivateKey is not defined");
  }
};
