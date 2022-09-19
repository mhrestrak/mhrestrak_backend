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
const update = require("../../middleware/databaseActions/update");
const getItemById = require("../../utils/db_get")

const db = require("../../startup/database");
const sql = require("mssql");

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn), create(model)],
  async (req, res) => {
    console.log("fdfdf")
    /// Updating active flag
    console.log(req.data)
    const pool = await db();
    console.log("admission created")
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("isActive", sql.Bit, true);
    poolRequest.input("ResID", sql.VarChar, req.body.ResID);
    poolRequest.input("RecentPhase", sql.VarChar, req.body.RecentPhase);
    poolRequest.input("RoomNum", sql.VarChar, req.body.RoomNum);
    poolRequest.input("RecentAdmissionID", sql.VarChar, req.body.AdmissionID)
    poolRequest.input("LastEntryDate", sql.DateTime, req.body.GuestInDate)
    let string = `update ResProfile set RecentAdmissionID = @RecentAdmissionID, isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum, RecentPhase = @RecentPhase where ResID = @ResID`;
    // let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    const updatedResProfile = await poolRequest.query(string);

    res.send(req.data);
  }
);

router.post(
  "/exit",
  [auth, isIntakeCoordinator, validate(validateReturn), update(model)],
  async (req, res) => {
    /// Updating active flag
    console.log(req.body)
    // return res.send(req.data)
    const pool = await db();
    console.log("admission updated");
    //@ts-ignore
    const poolRequest = await pool.request();
    poolRequest.input("isActive", sql.Bit, false);
    poolRequest.input("ResID", sql.VarChar, req.body.ResID);
    // poolRequest.input("RecentPhase", sql.VarChar, req.body.RecentPhase);
    poolRequest.input("RoomNum", sql.VarChar, "");
    let string = `update ResProfile set isActive = @isActive, RoomNum = @RoomNum where ResID = @ResID`;
    // let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    await poolRequest.query(string);

    res.send(req.data);
  }
);

router.get("/:id",[auth, isIntakeCoordinator],
  async (req, res) => {
    let resID = req.params.id;
    if (!resID) return res.status(404).send("Please provide a Resident ID!");

    try {
      let resident = await getItemById("ResProfile", "ResID", "NVarChar", resID)
      if(!resident.found) return res.status(404).send("REsident not found.");
      console.log(resident)
      if(!resident.data.RecentAdmissionID) return res.status(404).send("Resident does not have an admission.");
      console.log(resident.data.RecentAdmissionID)
      let admission = await getItemById("ResAdmission", "AdmissionID", "VarChar", resident.data.RecentAdmissionID)
      if(!admission.found) return res.status(404).send("Resident does not have an admission.");
      res.send(admission.data);
    } catch (error) {
      console.log(error);
      res.status(400).send("Failed Database connection");
    }
  }
);

module.exports = router;
