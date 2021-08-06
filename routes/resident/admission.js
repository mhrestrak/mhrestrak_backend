const express = require("express");
const {
  model,
  validate: validateReturn,
} = require("../../models/resident/resident_admission");
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const create = require("../../middleware/databaseActions/create");

const db = require("../../startup/database");
const sql = require("mssql");

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn), create(model)],
  (req, res) => {
    /// Updating active flag
    const pool = await db();
    const poolRequest = await pool.request();
    poolRequest.input("isActive", sql.Bit, 1);
    poolRequest.input("ResID", sql.VarChar, req.body.ResID);
    let string = `update ResProfile set isActive = @isActive where ResID = @ResID`;
    const updatedResProfile = await poolRequest.query(string);

    res.send(req.data);
  }
);

module.exports = router;
