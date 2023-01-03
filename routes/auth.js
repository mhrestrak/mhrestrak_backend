const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const db = require("../startup/database");
const sql = require("mssql");
const { userToken } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;

  try {
    const pool = await db();
    user = await pool
      .request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
    user = user.recordset;
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Failed Database connection");
  }

  if (user.length === 0)
    return res.status(400).send("Invalid Email or password..");
  console.log(req.body.pass);
  console.log(user);
  const validPassword = await bcrypt.compare(req.body.pass, user[0].pass);
  console.log(validPassword);
  if (!validPassword)
    return res.status(400).send("Invalid Email or password..");

  const token = userToken(user[0]);
  res.send(token);
});

async function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email().min(5),
    pass: Joi.string().required().min(5).max(255),
  });
  return schema.validate(req);
}
module.exports = router;
