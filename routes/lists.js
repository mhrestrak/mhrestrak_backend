const express = require("express");
const sql = require("mssql");

const db = require("../startup/database");
const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query;
  let listNameID = query.listid;
  try {
    const pool = await db();
    const poolRequest = await pool.request();

    poolRequest.input("ListNameID", sql.Int, listNameID);

    let string = `SELECT * from Lists where ListNameID = @ListNameID`;
    const data = await poolRequest.query(string);

    res.send(data.recordset);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

module.exports = router;
