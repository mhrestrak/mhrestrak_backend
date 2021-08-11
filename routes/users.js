const express = require("express");
const { userToken, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../startup/database");
const sql = require("mssql");
const uniqid = require("uniqid");

router.get("/me", auth, async (req, res) => {
  try {
    const pool = db();
    const user = await pool
      .request()
      .input("_id", sql.VarChar, req.user._id)
      .query("SELECT * from Users where _id = @_id");
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  try {
    const pool = db();
    user = await pool
      .request()
      .input("email", sql.VarChar, req.user.email)
      .query("SELECT * from Users where email = @email");
  } catch (error) {
    res.status(400).send(error);
  }

  console.log(user);

  if (user) return res.status(400).send("User alrseady registered..");

  user = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "pass",
    "isAdmin",
    "isIntakeCoordinator",
  ]);

  user._id = uniqid();
  const salt = await bcrypt.genSalt(10);
  user.pass = await bcrypt.hash(user.pass, salt);

  try {
    const pool = db();
    const addedUser = await pool
      .request()
      .input("firstName", sql.VarChar, user.firstName)
      .input("lastName", sql.VarChar, user.lastName)
      .input("_id", sql.VarChar, user._id)
      .input("email", sql.VarChar, user.email)
      .input("pass", sql.VarChar, user.pass)
      .input("isAdmin", sql.Bit, user.isAdmin ? 1 : 0)
      .input("isIntakeCoordinator", sql.Bit, user.isIntakeCoordinator ? 1 : 0)
      .query(
        "INSERT INTO Users (firstName, lastName, email, pass, isAdmin, isIntakeCoordinator, _id)"
      );

    console.log(addedUser.recordsets);
    const token = userToken(addedUser.recordsets);
    res.header("x-auth-token", token).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
