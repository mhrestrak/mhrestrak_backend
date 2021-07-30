const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const db = require("../startup/database");
const sql = require("mssql");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;

  try {
    const pool = db();
    const user = await pool
      .request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
    user = user.recordsets;
  } catch (error) {
    res.status(400).send(error);
  }

  if (!user) return res.status(400).send("Invalid Username or password..");

  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Username or password..");

  const token = user.generateAuthToken();
  res.send(token);
});

async function validate(req) {
  return Joi.validate(req, {
    email: Joi.string().required().max(255).email().min(5),
    password: Joi.string().required().min(5).max(255),
  });
}
module.exports = router;
