const express = require("express");
const { userToken, validate, model } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const db = require("../startup/database");
const sql = require("mssql");
const { sendEmail } = require("../services/sendgrid");
const config = require("config");

router.get("/status/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    const pool = await db();
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("_id", sql.VarChar, userId);
    let query = `SELECT * from Users WHERE _id=@_id`;
    let data = await poolRequest.query(query);
    if (data.recordset.length > 0) {
      let user = data.recordset[0];
      user.pass = undefined;
      return res.send({
        _id : user._id,
        isActive : user.isActive,
        invitePending : user.invitePending
      });
    }
    return res.status(404).send("User not found");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

router.get("/:id", [auth, admin], async (req, res) => {
  let userId = req.params.id;
  try {
    const pool = await db();
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("_id", sql.VarChar, userId);
    let query = `SELECT * from Users WHERE _id=@_id`;
    let data = await poolRequest.query(query);
    if (data.recordset.length > 0) {
      let user = data.recordset[0];
      user.pass = undefined;
      return res.send(user);
    }
    return res.status(404).send("User not found");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

router.post("/getUsers", [auth, admin], async (req, res) => {
  console.log(req.body, 1);
  let filters = req.body;
  try {
    const pool = await db();

    const poolRequest = await pool.request();

    let query = "SELECT * from Users";

    if (filters.Center || filters.Role || filters.Status) {
      query = `${query} where`;

      let center, role, status;
      if (filters.Center) {
        query = `${query} Center = @Center`;
        poolRequest.input("Center", sql.VarChar, filters.Center);
        center = true;
      }

      if (filters.Role) {
        if (center) query = `${query} and`;
        switch (filters.Role) {
          case "Center Coordinator":
            query = `${query} isCenterCoordinator = @Role`;
            poolRequest.input("Role", sql.Bit, 1);
            break;
          case "Intake Coordinator":
            query = `${query} isIntakeCoordinator = @Role`;
            poolRequest.input("Role", sql.Bit, 1);
            break;
          case "Case Coordinator":
            query = `${query} isCaseCoordinator = @Role`;
            poolRequest.input("Role", sql.Bit, 1);
            break;
          case "House Manager":
            query = `${query} isHouseManager = @Role`;
            poolRequest.input("Role", sql.Bit, 1);
            break;
          default:
            break;
        }
        role = true;
      }

      if (filters.Status) {
        if (center || role) query = `${query} and`;

        if (filters.Status === "Invited") {
          query = `${query} invitePending = @Status`;
          poolRequest.input("Status", sql.Bit, 1);
        }

        if (filters.Status === "Active") {
          query = `${query} isActive = @Status`;
          poolRequest.input("Status", sql.Bit, 1);
        }

        status = true;
      }
    }

    console.log(query);
    const data = await poolRequest.query(query);
    console.log(data);
    const filtered = data.recordset.filter((item) => !item.isAdmin);
    res.send(filtered.map(({ pass, ...rest }) => rest));
    // res.send(data.recordset);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

router.post("/inviteUser", [auth, admin], async (req, res) => {
  
  let body = req.body;
  body.isActive = false;
  body.invitePending = true;

  let allUsers = await getUsers();
  let exists;
  allUsers.forEach((user) => {
    if (user.email === body.email) exists = true;
  });
  if (exists) return res.send({ error: "User with email already Exists!" });

  try {
    let updatedModel = model(body);
    let string = `INSERT INTO Users (`;
    const pool = await db();
    let poolRequest = await pool.request();

    updatedModel.forEach((Item, i) => {
      if (i == 0) {
        string = string + Item.key;
      } else {
        string = string + "," + Item.key;
      }
      poolRequest.input(Item.key, sql[Item.type], Item.value);
    });

    string = string + ") values (";
    updatedModel.forEach((Item, i) => {
      if (i == 0) {
        string = string + `@${Item.key}`;
      } else {
        string = string + "," + `@${Item.key}`;
      }
    });
    string = string + ")";

    console.log("3");
    console.log(string);
    let data = await poolRequest.query(string);
    // send invitation

    let emailData = {
      to: body.email,
      variables: {
        url: `${config.get("frontendUrl")}/completeSignup/` + body._id,
      },
    };

    await sendEmail(emailData);
    res.send(data);
    //@ts-ignore
    // pool.close();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.put("/updateUser", [auth, admin], async (req, res) => {
  let body = req.body;
  const pool = await db();
  let data;
  try {
    let updatedModel = model(body);

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
    console.log(query);
    data = await poolRequest.query(query);
    res.send(data);
    //@ts-ignore
    // pool.close();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

async function getUsers() {
  const pool = await db();
  const poolRequest = await pool.request();
  let query = "SELECT * from Users";
  const data = await poolRequest.query(query);
  return data.recordset;
}

module.exports = router;
