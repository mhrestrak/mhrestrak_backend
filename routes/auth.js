const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const db = require("../startup/database");
const sql = require("mssql");
const { userToken, model } = require("../models/user");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  //@ts-ignore
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;

  try {
    const pool = await db();
    //@ts-ignore
  user = await pool.request()
      .input("email", sql.VarChar, req.body.email)
      .query("SELECT * from Users where email = @email");
    user = user.recordset;
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("Failed Database connection");
  }

  if (user.length === 0)
    return res.status(401).send("Email not Found!");
  console.log(req.body.pass);
  console.log(user);
  const validPassword = await bcrypt.compare(req.body.pass, user[0].pass);
  console.log(validPassword);
  if (!validPassword)
    return res.status(401).send("Incorrect Password!");

  const token = userToken(user[0]);
  res.send(token);
});

router.post("/resetPassword", [auth], async (req, res) => {
  if (!req.body.password) return res.status(400).send("Enter Password!");
  let body = req.body
  const pool = await db();

  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);

  try{

  let um = {
    pass : body.password,
  }

  let updatedModel = model(um);
  let query = `UPDATE Users SET `;
  //@ts-ignore
  let poolRequest = await pool.request();

  updatedModel.forEach((Item, i) => {
    if (i === 0) {
      query = query + `${Item.key}=@${Item.key}`;
    } else {
      query = query + `, ${Item.key}=@${Item.key}`;
    }
    poolRequest.input(Item.key, sql[Item.type], Item.value);
  });

  query = query + ` WHERE _id='${req.user["_id"]}'`;

  await poolRequest.query(query);

  //@ts-ignore
  let user = await pool.request()
    .input("email", sql.VarChar, req.body.email)
    .query(`SELECT * from Users  WHERE _id='${body["_id"]}'`);
  user = user.recordset;
  res.send(user[0]);
    //@ts-ignore
    // pool.close();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.put("/updateProfile", [auth], async (req, res) => {
  if (req.user._id !== req.body?._id)
    return res.status(400).send("Restricted!");

  let body = req.body;
  const pool = await db();
  let data;
  try {
    let updatedModel = model(body);

    let filtered = [];
    updatedModel.forEach((prop) => {
      if (
        prop.key === "email" ||
        prop.key === "lastName" ||
        prop.key === "firstName"
      ) {
        filtered.push(prop);
      }
    });

    let query = `UPDATE Users SET `;
    //@ts-ignore
    let poolRequest = await pool.request();

    filtered.forEach((Item, i) => {
      if (i === 0) {
        query = query + `${Item.key}=@${Item.key}`;
      } else {
        query = query + `, ${Item.key}=@${Item.key}`;
      }
      poolRequest.input(Item.key, sql[Item.type], Item.value);
    });

    query = query + ` WHERE _id='${body["_id"]}'`;
    console.log(query);
    data = await poolRequest.query(query);

    //@ts-ignore
  let user = await pool.request()
      .input("email", sql.VarChar, req.body.email)
      .query(`SELECT * from Users  WHERE _id='${body["_id"]}'`);
    user = user.recordset;
    const token = userToken(user[0]);
    res.send(token);
    //@ts-ignore
    // pool.close();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.put("/activateUser", async (req, res) => {

  let body = req.body;

  const pool = await db();
  let data;
  try {
    const salt = await bcrypt.genSalt(10);
    body.pass = await bcrypt.hash(body.pass, salt);
    
    let um = {
      _id : body._id,
      pass : body.pass,
      invitePending : false,
      isActive : true
    }

    let updatedModel = model(um);

    let query = `UPDATE Users SET `;
    //@ts-ignore
    let poolRequest = await pool.request();

    updatedModel.forEach((Item, i) => {
      if (i === 0) {
        query = query + `${Item.key}=@${Item.key}`;
      } else {
        query = query + `, ${Item.key}=@${Item.key}`;
      }
      poolRequest.input(Item.key, sql[Item.type], Item.value);
    });

    query = query + ` WHERE _id='${body["_id"]}'`;

    data = await poolRequest.query(query);

    //@ts-ignore
  let user = await pool.request()
      .input("email", sql.VarChar, req.body.email)
      .query(`SELECT * from Users  WHERE _id='${body["_id"]}'`);
    user = user.recordset;
    const token = userToken(user[0]);
    res.send(token);
    //@ts-ignore
    // pool.close();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

async function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email().min(5),
    pass: Joi.string().required().min(5).max(255),
  });
  return schema.validate(req);
}
module.exports = router;
