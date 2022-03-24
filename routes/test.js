const express = require("express");
const router = express.Router();
const db = require("../startup/database");
const sql = require("mssql");
const uniqid = require("uniqid");

router.get("/", async (req, res) => {
  // console.log(req);
  // try {
  //   console.log("Sd");
    let pool = await db();
    const poolRequest = await pool
    //@ts-expect-error
      .request()
      .query(
        `select * from ResProfile`
      );
  //   //   .input("_id", sql.VarChar, req.user._id)
  //   //   .query("SELECT * [except password] from Users where _id = @_id");
  //   // .query(`ALTER TABLE ResProfile ALTER COLUMN ResID NVARCHAR(100)`);
  //   console.log(user);
    res.send(poolRequest.recordsets);
  // } catch (error) {
  //   console.log("dff", error);
  //   res.status(400).send(error);
  // }
});

//Bulk import

router.post("/", async (req, res) => {
  let json = req.body;
  let formatted = [];
  let admission = [];
  json.forEach((resident) =>{
    let ResID = uniqid()
    let admissionId = uniqid()
    let phase = resident.Phase === "Guest" ? "0" : resident.Phase.toString()
    formatted.push({
      ResFirstName: resident.First,
      ResLastName: resident.Last,
      ResID,
      IsActive: true,
      RoomNum: resident.Room.toString(),
      RecentPhase: phase,
      RecentAdmissionID : admissionId,
      LastEntryDate : new Date(resident["Date In"])
    })

    admission.push({
      GuestInDate : new Date(resident["Date In"]),
      ResID,
      RecentPhase : phase,
      RoomNum : resident.Room.toString(),
      AdmissionID : admissionId
    })
  }
  );

  let query = "INSERT INTO ResProfile ("
  let keys = Object.keys(formatted[0])
  keys.forEach((key, i) => {
    if (i == 0) {
      query  = query + key;
    } else {
      query = query + "," + key;
    }
  });
  const pool = await db();
  //@ts-ignore
  let poolRequest = await pool.request();
  query = query+ ") values ";
  formatted.forEach((Item, i) => {
    let objKeys = Object.keys(formatted[0])
    if(i === 0){
      query = query+ " (";
    }else{
      query = query+ ", (";
    }
    objKeys.forEach((key,ie) =>{
      let objectKey = uniqid()
      poolRequest.input(objectKey, key === "IsActive" ? sql["Bit"]: key === "LastEntryDate" ? sql["Date"] :sql["VarChar"], formatted[i][key]);
      if (ie === 0) {
        query = query + `@${objectKey}`;
      } else {
        query = query + "," + `@${objectKey}`;
      }
    })
    query = query + ")"
  });
  console.log(query)
  let data = await poolRequest.query(query);
  
  let query1 = "INSERT INTO ResAdmission ("
  let keys1 = Object.keys(admission[0])
  keys1.forEach((key, i) => {
    if (i == 0) {
      query1  = query1+ key;
    } else {
      query1 = query1 + "," + key;
    }
  });
  const pool1 = await db();
  //@ts-ignore
  let poolRequest1 = await pool.request();
  query1 = query1+ ") values ";
  admission.forEach((Item, i) => {
    let objKeys = Object.keys(admission[0])
    if(i === 0){
      query1 = query1+ " (";
    }else{
      query1 = query1+ ", (";
    }
    objKeys.forEach((key,ie) =>{
      let objectKey = uniqid()
      poolRequest1.input(objectKey, key === "GuestInDate" ? sql["Date"]: sql["VarChar"], admission[i][key]);
      if (ie === 0) {
        query1 = query1 + `@${objectKey}`;
      } else {
        query1 = query1 + "," + `@${objectKey}`;
      }
    })
    query1 = query1 + ")"
  });
  console.log(query1)
  let data1 = await poolRequest1.query(query1);

  res.send(data1);
})

module.exports = router;
