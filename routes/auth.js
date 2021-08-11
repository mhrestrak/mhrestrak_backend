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
    const user = await pool
      .request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
    user = user.recordsets;
    console.log("Sdfd");
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }

  if (!user) return res.status(400).send("Invalid Username or password..");

  const validPassword = bcrypt.compare(req.body.pass, user.pass);
  if (!validPassword)
    return res.status(400).send("Invalid Username or password..");

  const token = userToken(user);
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
