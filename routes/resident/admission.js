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
  async (req, res) => {
    /// Updating active flag
    const pool = await db();
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("isActive", sql.Bit, true);
    poolRequest.input("ResID", sql.VarChar, req.body.ResID);
    poolRequest.input("RoomNum", sql.Int, req.body.RoomNum);
    poolRequest.input("LastEntryDate", sql.DateTime, req.body.GuestInDate)
    let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    const updatedResProfile = await poolRequest.query(string);

    res.send(req.data);
  }
);

module.exports = router;
