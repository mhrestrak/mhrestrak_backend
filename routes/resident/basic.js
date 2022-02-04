const db = require("../../startup/database")
const sql = require("mssql");
const express = require("express");
const {
  model,
  validate: validateReturn,
  validateUpdate,
} = require("../../models/resident/resident_basic");
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const create = require("../../middleware/databaseActions/create");
const { date } = require("joi");



router.post("/",[auth, isIntakeCoordinator, validate(validateReturn), create(model)],
(req, res) => {
  res.send(req.data);
}
);

router.get("/active", [auth, isIntakeCoordinator], async (req,res) =>{
  let query = `SELECT * from ResProfile WHERE IsActive=1`
  const pool = await db();
    //@ts-ignore
  let poolRequest = await pool.request();
  let data = await poolRequest.query(query);
  return res.send(data)
})

router.post("/update",[auth, isIntakeCoordinator, validate(validateUpdate)],
async (req, res) => {
  let body = req.body;
  try {
    let updatedModel = model({
      IsActive: body["IsActive"],
      RoomNum: body["RoomNum"],
      RecentPhase: body["RecentPhase"],
    });
    let tableName = "ResProfile"
    
    let query = `UPDATE ${tableName} SET `;
    
    const pool = await db();
    //@ts-ignore
    let poolRequest = await pool.request();
    
    let room;

    updatedModel.forEach((Item, i) =>{
      if(Item.key === "RoomNum") room =true
      if(i === 0){
        query = query + `${Item.key}=@${Item.key}`;
      }else{
        query = query + `, ${Item.key}=@${Item.key}`;
      }
      poolRequest.input(Item.key, sql[Item.type], Item.value);
    })
    if(!room){
      query = query + `, RoomNum = @Room`;
      poolRequest.input("Room", sql.Int, null)
    }
    
    query = query+ ` WHERE ResID='${body["ResID"]}'`
    
    let data = await poolRequest.query(query);
    res.send(data)
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
}
);

module.exports = router;
