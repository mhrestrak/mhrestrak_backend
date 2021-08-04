const express = require("express");
const router = express.Router();
const db = require("../startup/database");
const sql = require("mssql");

router.get("/", async (req, res) => {
  try {
    let pool = await db();
    const user = await pool
      .request()
      .query(`ALTER TABLE ResProfile ALTER COLUMN ResID NVARCHAR(100)`);
    // `SELECT * from ResProfile
    //   where
    //   ResID is not null
    //   and
    //   SSN is not null`
    //   .input("_id", sql.VarChar, req.user._id)
    //   .query("SELECT * [except password] from Users where _id = @_id");
    console.log(user);
    res.send(user.recordsets);
  } catch (error) {
    console.log("dff", error);
    res.status(400).send(error);
  }
});

module.exports = router;
