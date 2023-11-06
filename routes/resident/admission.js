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
const level3Access = require("../../middleware/level3Access");
const level1Access = require("../../middleware/level1Access");

router.post(
  "/",
  [auth, level3Access, validate(validateReturn), create(model)],
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
  [auth, level3Access, validate(validateReturn), update(model)],
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

router.get("/records/activeresidentswithdevices",[auth],
  async (req, res) => {
    let query = `SELECT * from ResProfile WHERE IsActive=1`;
    const pool = await db();
    //@ts-ignore
    let poolRequest = await pool.request();
    let data = await poolRequest.query(query);
    console.log("122", data)
    let residents = data.recordset
    
    if(residents.length === 0) return res.send([]);
    console.log(residents[10])
    
    let admissionString = ""
    
    residents.forEach((res,i) =>{
      admissionString = 
      res.RecentAdmissionID ? 
      `${admissionString}${i === 0 ? "" : " OR "}AdmissionID LIKE '%${res.RecentAdmissionID}%'` : 
      admissionString
    }
    )
    
    let admissionQuery = `SELECT * from ResAdmission where (${admissionString})`
    //@ts-ignore
    let data1 = await poolRequest.query(admissionQuery);
    console.log("133", data1)
    
    let admissions = data1.recordset

    let ResidentWithAdmissionData = []
    
    admissions.forEach((admi) =>{
      let data= {
        AdmissionID : admi.AdmissionID,
        ResID: admi.ResID,
        HasMobile : admi.HasMobile,
        HasTablet : admi.HasTablet,
        CheckedInMobile : admi.CheckedInMobile, 
        CheckedInTablet : admi.CheckedInTablet, 
      }
      residents.forEach((res) =>{
        if(res.ResID === admi.ResID){
          data.ResFirstName = res.ResFirstName
          data.ResLastName = res.ResLastName
        }
      })
      ResidentWithAdmissionData.push(data)
    })
    res.send(ResidentWithAdmissionData.sort((a, b) => (a.ResFirstName.toLowerCase() > b.ResFirstName.toLowerCase() ? 1 : -1)))
  }
)

router.put("/addDeviceToAdmission", [auth], async (req, res) => {
    /// Updating active flag
    console.log(req.body)
    // return res.send(req.data)
    const pool = await db();
    const poolRequest = await pool.request();
    poolRequest.input("device", sql.Bit, true);
    poolRequest.input("AdmissionID", sql.VarChar, req.body.id);

    let string = `update ResAdmission set Has${req.body.deviceType} = @device where AdmissionID = @AdmissionID`;
    // let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    await poolRequest.query(string);

    res.send(req.data);
  }
);

router.put("/toggleCheckInResidentDevice", [auth], async (req, res) => {
    /// Updating active flag
    console.log(req.body)
    // return res.send(req.data)
    const pool = await db();
    const poolRequest = await pool.request();
    poolRequest.input("checkin", sql.Bit, req.body.checkIn ? true : false);
    poolRequest.input("AdmissionID", sql.VarChar, req.body.id);

    let string = `update ResAdmission set CheckedIn${req.body.deviceType} = @checkin where AdmissionID = @AdmissionID`;
    // let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    await poolRequest.query(string);

    res.send(req.data);
  }
);

router.put("/removeDeviceFromAdmission", [auth], async (req, res) => {
    /// Updating active flag
    console.log(req.body)
    // return res.send(req.data)
    const pool = await db();
    const poolRequest = await pool.request();
    poolRequest.input("device", sql.Bit, false);
    poolRequest.input("AdmissionID", sql.VarChar, req.body.id);

    let string = `update ResAdmission set Has${req.body.deviceType} = @device where AdmissionID = @AdmissionID`;
    // let string = `update ResProfile set isActive = @isActive, LastEntryDate = @LastEntryDate, RoomNum = @RoomNum where ResID = @ResID`;
    await poolRequest.query(string);

    res.send(req.data);
  }
);

router.get("/records/:id",[auth, level1Access],
  async (req, res) => {
    let resID = req.params.id;
    if (!resID) return res.status(404).send("Please provide a Resident ID!");

    try {
        const pool = await db();
        //@ts-ignore
        const poolRequest = await pool.request();
        poolRequest.input("ResId", sql.VarChar, resID);
        let query = `SELECT * from ResAdmission WHERE ResId=@ResId`;
        let data = await poolRequest.query(query);
        return res.send(data.recordset);
    } catch (error) {
      console.log(error);
      res.status(400).send("Failed Database connection");
    }
  }
);

router.get("/:id",[auth, level1Access],
  async (req, res) => {
    let resID = req.params.id;
    if (!resID) return res.status(404).send("Please provide a Resident ID!");

    try {
      let resident = await getItemById("ResProfile", "ResID", "NVarChar", resID)
      if(!resident.found) {
        resident = await getItemById("ResAdmission", "AdmissionID", "VarChar", resID)
        if(!resident.found) return res.status(404).send("REsident not found.");
        return res.send(resident.data);
      }
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
