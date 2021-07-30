const express = require("express");
const users = require("../routes/users");
const cors = require("cors");
const auth = require("../routes/auth");
// const error = require("../middleware/error");

module.exports = function (app) {
  //----------------------Setting route handlers--------------------------
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  //   app.use(cors({ origin: "https://hidden-beyond-42098.herokuapp.com" }));
  //--------------------Request pipeline Error handeling---------------------
  //   app.use(error);
};
