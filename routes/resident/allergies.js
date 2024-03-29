const express = require("express");

const auth = require("../../middleware/auth");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const validate = require("../../middleware/validate");
const {
  model,
  validate: validateReturn,
} = require("../../models/resident/resident_allergies");
const create = require("../../middleware/databaseActions/create");

const router = express.Router();
const sql = require("mssql");
const db = require("../../startup/database");
const update = require("../../middleware/databaseActions/update");
const _delete = require("../../middleware/databaseActions/delete");
const level2Access = require("../../middleware/level2Access");
const level3Access = require("../../middleware/level3Access");
const level1Access = require("../../middleware/level1Access");

router.post(
  "/",
  [auth, level2Access, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
);

router.put(
  "/",
    [auth, level2Access, validate(validateReturn), update(model)],
    async (req, res) => {
      res.send(req.data);
    }
  );

  router.delete("/:id",[auth, level2Access, _delete()],async (req, res) => {
    res.send(req.data);
});

router.get("/:id", [auth, level1Access], async (req, res) => {
let resID = req.params.id;
try {
  const pool = await db();
  //@ts-ignore
  const poolRequest = await pool.request();
  poolRequest.input("ResId", sql.VarChar, resID);
  let query = `SELECT * from ResAllergies WHERE ResId=@ResId`;
  let data = await poolRequest.query(query);
  return res.send(data.recordset);
} catch (error) {
  console.log(error);
  res.status(400).send("Failed Database connection");
}
});

module.exports = router;
