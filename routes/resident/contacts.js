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
const level2Access = require("../../middleware/level2Access");
const level1Access = require("../../middleware/level1Access");
const level3Access = require("../../middleware/level3Access");
const update = require("../../middleware/databaseActions/update");

router.post(
  "/",
  [auth, level2Access, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
);



router.get("/:id", [auth, level1Access], async (req, res) => {
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

router.put(
  "/",
    [auth, level3Access, validate(validateReturn), update(model)],
    async (req, res) => {
      res.send(req.data);
    }
  );

module.exports = router;
