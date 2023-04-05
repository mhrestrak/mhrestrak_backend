const express = require("express");

const auth = require("../../middleware/auth");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const validate = require("../../middleware/validate");
const {
  model,
  validate: validateReturn,
} = require("../../models/resident/resident_contacts");
const create = require("../../middleware/databaseActions/create");

const router = express.Router();

const sql = require("mssql");
const db = require("../../startup/database");

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
);



router.get("/:id", [auth], async (req, res) => {
let resID = req.params.id;
try {
  const pool = await db();
  //@ts-ignore
  const poolRequest = await pool.request();
  poolRequest.input("ResId", sql.VarChar, resID);
  let query = `SELECT * from ResContacts WHERE ResId=@ResId`;
  let data = await poolRequest.query(query);
  return res.send(data.recordset);
} catch (error) {
  console.log(error);
  res.status(400).send("Failed Database connection");
}
});

module.exports = router;
