const express = require("express");
const _ = require("lodash");
const { sendVerification, verifyCode } = require("../services/twillio");
const router = express.Router();
const db = require("../startup/database");
const sql = require("mssql");
const { userToken } = require("../models/user");

router.post("/getCode", async (req, res) => {
  console.log("SDf", req.body.email);
  if (!req.body.email) return res.status(404).send("Provide Email...");
  let user;
  try {
    const pool = await db();
    //@ts-ignore
    user = await pool.request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
  } catch (error) {
    console.log("error", error);
    return res.status(400).send(error);
  }

  if (user.recordset.length === 0)
    return res.send({ error: "Email Not Registered!" });
  try {
    let verification = await sendVerification(req.body.email);
    res.send(verification);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/verifyCode", async (req, res) => {
  if (!req.body.email || !req.body.code)
    return res.status(404).send("Provide Email or code...");
  let user;
  try {
    const pool = await db();
    //@ts-ignore
    user = await pool.request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
  } catch (error) {
    console.log("error", error);
    return res.status(400).send(error);
  }

  if (user.recordset.length === 0)
    return res.send({ error: "Email Not Registered!" });

  try {
    let verification = await verifyCode(req.body.email, req.body.code);
    console.log(verification);
    if (verification.status === "approved")
      verification["jwt"] = userToken(user.recordset[0]);
    console.log(verification);
    res.send(verification);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
