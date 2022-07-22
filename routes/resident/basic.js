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

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn), create(model)],
  (req, res) => {
    res.send(req.data);
  }
);

router.get("/active", [auth, isIntakeCoordinator], async (req, res) => {
  let query = `SELECT * from ResProfile WHERE IsActive=1`;
  const pool = await db();
  //@ts-ignore
  let poolRequest = await pool.request();
  let data = await poolRequest.query(query);
  return res.send(data);
});

router.post(
  "/update",
  [auth, isIntakeCoordinator, validate(validateUpdate)],
  async (req, res) => {
    let body = req.body;
    console.log(body)
    let data
    try {
      let updatedModel = model({
        RoomNum: body["RoomNum"],
        RecentPhase: body["RecentPhase"],
      });
      console.log(updatedModel)
      let tableName = "ResProfile";

      let query = `UPDATE ${tableName} SET `;

      const pool = await db();
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
      if (!room) {
        query = query + `, RoomNum = @Room`;
        poolRequest.input("Room", sql.Int, null);
      }

      query = query + ` WHERE ResID='${body["ResID"]}'`;
      console.log(query)
      data = await poolRequest.query(query);
      //@ts-ignore
      pool.close();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }

    try {
      let Ad_updatedModel = adModel({
        RoomNum: body["RoomNum"],
        RecentPhase: body["RecentPhase"],
      });
      let Ad_tableName = "ResAdmission";

      let Ad_query = `UPDATE ${Ad_tableName} SET `;

      const Ad_pool = await db();
      //@ts-ignore
      let Ad_poolRequest = await Ad_pool.request();

      let room;

      Ad_updatedModel.forEach((Item, i) => {
        if (Item.key === "RoomNum") room = true;
        if (i === 0) {
          Ad_query = Ad_query + `${Item.key}=@${Item.key}`;
        } else {
          Ad_query = Ad_query + `, ${Item.key}=@${Item.key}`;
        }
        Ad_poolRequest.input(Item.key, sql[Item.type], Item.value);
      });
      if (!room) {
        Ad_query = Ad_query + `, RoomNum = @Room`;
        Ad_poolRequest.input("Room", sql.Int, null);
      }

      Ad_query = Ad_query + ` WHERE ResID='${body["ResID"]}'`;

      let Ad_data = await Ad_poolRequest.query(Ad_query);

      res.send();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
);

module.exports = router;
