const db = require("../../startup/database");
const sql = require("mssql");
const express = require("express");
const {
  model,
  validate: validateReturn,
  validateUpdate,
} = require("../../models/resident/resident_basic");
const { model: adModel } = require("../../models/resident/resident_admission");
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const create = require("../../middleware/databaseActions/create");
const { date } = require("joi");
const getItemById = require("../../utils/db_get");
const { generateObjectUrl, deleteAwsObject } = require("../../services/aws");
const level2Access = require("../../middleware/level2Access");
const level1Access = require("../../middleware/level1Access");
const level4Access = require("../../middleware/level4Access");
const level3Access = require("../../middleware/level3Access");

router.post(
  "/",
  [auth, level3Access, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
);

router.get("/active", [auth, level1Access], async (req, res) => {
  let query = `SELECT * from ResProfile WHERE IsActive=1`;
  const pool = await db();
  //@ts-ignore
  let poolRequest = await pool.request();
  let data = await poolRequest.query(query);
  return res.send(data);
});

router.post("/DL_Report", [auth, level2Access], async (req, res) => {
  let body = req.body;
  const startDate = body.startDate
  const endDate = body.EndDate

  const pool = await db();
  //@ts-ignore
  let poolRequest = await pool.request();
  poolRequest.input("startDate", sql.DateTime, startDate)
  poolRequest.input("endDate", sql.DateTime, endDate)
  let query = `SELECT * from ResAdmission WHERE DateOut >= @startDate and DateOut <= @endDate`;
  let data = await poolRequest.query(query);
  
  if(data.recordset?.length > 0){

  let listNameID = 10;
    const poolList = await db();
    //@ts-ignore
    const poolRequestList = await poolList.request();
    poolRequestList.input("ListNameID", sql.Int, listNameID);

    let string = `SELECT * from Lists where ListNameID = @ListNameID`;
    const {recordset : list} = await poolRequestList.query(string);
    list.forEach((w,i) =>{
      list[i].count = 0
    })
    data.recordset.forEach((item) =>{
      list.forEach((listItem, i) =>{
        if(item.DischargeLocation === listItem.ListValueID.toString()){
          list[i].count = list[i].count+1
        }
      })
    })
    let report = []
    list.forEach((location) =>{
      if(location.count > 0){
        report.push({
          Location : location.ListValue,
          count : location.count
        })
      }
    })
    return res.send(report);
  }else{
    return res.send([]);
  }
});

router.post(
  "/update",
  [auth, level2Access, validate(validateUpdate)],
  async (req, res) => {
    let body = req.body;
    const pool = await db();
    let data
    try {
      let updatedModel = model(body)

      // let updatedModel = model({
      //   RoomNum: body["RoomNum"],
      //   RecentPhase: body["RecentPhase"],
      // });
      let tableName = "ResProfile";

      let query = `UPDATE ${tableName} SET `;

      //@ts-ignore
      let poolRequest = await pool.request();

      let room;

      updatedModel.forEach((Item, i) => {
        if (Item.key === "RoomNum") room = true;
        if (i === 0) {
          query = query + `${Item.key}=@${Item.key}`;
        } else {
          query = query + `, ${Item.key}=@${Item.key}`;
        }
        poolRequest.input(Item.key, sql[Item.type], Item.value);
      });
      
      // Commented in New Update

      // if (!room) {
      //   query = query + `, RoomNum = @Room`;
      //   poolRequest.input("Room", sql.Int, null);
      // }

      query = query + ` WHERE ResID='${body["ResID"]}'`;
      data = await poolRequest.query(query);
      //@ts-ignore
      // pool.close();
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }

    // try {
    //   let Ad_updatedModel = adModel({
    //     RoomNum: body["RoomNum"],
    //     RecentPhase: body["RecentPhase"],
    //   });
    //   let Ad_tableName = "ResAdmission";

    //   let Ad_query = `UPDATE ${Ad_tableName} SET `;

    //   const Ad_pool = await db();
    //   //@ts-ignore
    //   let Ad_poolRequest = await Ad_pool.request();

    //   let room;

    //   Ad_updatedModel.forEach((Item, i) => {
    //     if (Item.key === "RoomNum") room = true;
    //     if (i === 0) {
    //       Ad_query = Ad_query + `${Item.key}=@${Item.key}`;
    //     } else {
    //       Ad_query = Ad_query + `, ${Item.key}=@${Item.key}`;
    //     }
    //     Ad_poolRequest.input(Item.key, sql[Item.type], Item.value);
    //   });
    //   if (!room) {
    //     Ad_query = Ad_query + `, RoomNum = @Room`;
    //     Ad_poolRequest.input("Room", sql.Int, null);
      // }

    //   Ad_query = Ad_query + ` WHERE ResID='${body["ResID"]}'`;

    //   let Ad_data = await Ad_poolRequest.query(Ad_query);
    let string = `SELECT * from ResProfile where ResID = @ResID`;
    // const pool = await db();
    //@ts-ignore
    const data1 = await pool.request()
      .input("ResID", sql.NVarChar, body["ResID"])
      .query(string);
      const resident = data1.recordset[0]
      if(resident?.ResPictureKey){
        if(resident.ResPictureKey.startsWith("ImgKey_")){
          resident.ResPictureUrl = generateObjectUrl(resident.ResPictureKey)
        }
      }

    res.send(resident);
    // } catch (error) {
    //   console.log(error);
    //   res.status(400).send(error);
    // }
  }
);

router.put("/imageUpdate", [auth], async (req, res) => {
    let body = req.body;
    const ResID = body.ResID
    const imageKey = body.key

    try {
        let resident = await getItemById("ResProfile", "ResID", "NVarChar", ResID)
        if(!resident.found) return res.status(404).send("Resident not found.");
        
        //delete previous photo
        if(resident.data.ResPictureKey){
            if (resident.data.ResPictureKey.startsWith("ImgKey_")) {
              await deleteAwsObject(resident.data.ResPictureKey)
            }
          }

        //UpdateProfile
        let string = `UPDATE ResProfile SET `;
        const Residentpool = await db();
        //@ts-ignore
        let ResidentpoolRequest = await Residentpool.request();
        string = string + "ResPictureKey=@ResPictureKey";
        ResidentpoolRequest.input("ResPictureKey", sql.VarChar, imageKey);
        ResidentpoolRequest.input("ResID", sql.VarChar, ResID);
        string = string + ` where  ResID=@ResID`;
        await ResidentpoolRequest.query(string);
        resident.data.ResPictureKey = imageKey
        resident.data.ResPictureUrl = generateObjectUrl(imageKey);
        res.send(resident.data);
      } catch (error) {
        console.log(error)
        return res.status(400).send("Filed to update User Image");
    }

})

router.post("/phaseUpdate", [auth, level2Access], async (req, res) => {
    let body = req.body;
    const ResID = body.ResID
    const phaseData = body.phaseData

    // const pool = await db();
    let data
    try {
      let resident = await getItemById("ResProfile", "ResID", "NVarChar", ResID)
      if(!resident.found) return res.status(404).send("Resident not found.");

      if(!resident.data.RecentAdmissionID) return res.status(404).send("Resident does not have an admission.");
      let admission = await getItemById("ResAdmission", "AdmissionID", "VarChar", resident.data.RecentAdmissionID)
      if(!admission.found) return res.status(404).send("Resident does not have an admission.");

      //UpdateProfile
      let string = `UPDATE ResProfile SET `;
      const Residentpool = await db();
      //@ts-ignore
      let ResidentpoolRequest = await Residentpool.request();
      string = string + "RecentPhase=@RecentPhase";
      ResidentpoolRequest.input("RecentPhase", sql.VarChar, phaseData[phaseData.length-1].phase);
      ResidentpoolRequest.input("ResID", sql.VarChar, ResID);
      string = string + ` where  ResID=@ResID`;
      let UpdatedResident = await ResidentpoolRequest.query(string);

      //UpdateProfile
      let Adstring = `UPDATE ResAdmission SET `;

      const Adpool = await db();
      //@ts-ignore
      let AdpoolRequest = await Adpool.request();
      Adstring = Adstring + "RecentPhase=@RecentPhase";
      AdpoolRequest.input("RecentPhase", sql.VarChar, phaseData[phaseData.length-1].phase);
      Adstring = Adstring + ", PhaseData=@PhaseData";
      AdpoolRequest.input("PhaseData", sql.VarChar, JSON.stringify(phaseData));
      AdpoolRequest.input("AdmissionID", sql.VarChar, resident.data.RecentAdmissionID);
      if(!admission.ProgramInDate && phaseData[phaseData.length-1].phase === "1"){
        Adstring = Adstring + ", ProgramInDate=@ProgramInDate";
        AdpoolRequest.input("ProgramInDate", sql.Date, phaseData[phaseData.length-1].inDate);
      }
      Adstring = Adstring + ` where  AdmissionID=@AdmissionID`;
      console.log(Adstring);
      let AdResident = await AdpoolRequest.query(Adstring);
      res.send({success :true});
  }catch(err){
    console.log(err)
    res.status(400).send(err);
  }
}
);

module.exports = router;
