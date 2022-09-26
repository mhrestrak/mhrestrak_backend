const express = require("express");
const {
  model,
  validate: validateReturn,
} = require("../../models/resident/resident_family");
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const create = require("../../middleware/databaseActions/create");

const sql = require("mssql");
const db = require("../../startup/database");

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
  );

  
router.get("/:id", [auth, isIntakeCoordinator], async (req, res) => {
  let resID = req.params.id;
  try {
    const pool = await db();
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("ResId", sql.VarChar, resID);
    let query = `SELECT * from ResFamily WHERE ResId=@ResId`;
    let data = await poolRequest.query(query);
    return res.send(data.recordset);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

module.exports = router;
