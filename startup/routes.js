const express = require("express");
const users = require("../routes/users");
const cors = require("cors");
const auth = require("../routes/auth");
const resident = require("../routes/resident");
const lists = require("../routes/lists");
const test = require("../routes/test");
// const error = require("../middleware/error");

module.exports = function (app) {
  //----------------------Setting route handlers--------------------------
  app.use(express.json());
  app.use(cors());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/test", test);
  app.use("/api/resident", resident);
  app.use("/api/lists", lists);
  //--------------------Request pipeline Error handeling---------------------
  //   app.use(error);
};
