const express = require("express");
const router = express.Router();
const db = require("../startup/database");
const sql = require("mssql");

router.get("/", async (req, res) => {
  // console.log(req);
  // try {
  //   console.log("Sd");
  //   let pool = await db();
  //   const poolRequest = await pool
  //     .request()
  //     .input("ResID", sql.VarChar, "1010")
  //     .input("SSN", sql.VarChar, "10101010")
  //     .input("ResFirstName", sql.VarChar, "Joshua")
  //     .input("ResLastName", sql.VarChar, "Fernandes")
  //     .query(
  //       `insert into ResProfile (ResID, SSN, ResFirstName, ResLastName) values (@ResID, @SSN, @ResFirstName, @ResLastName)`
  //     );
  //   //   .input("_id", sql.VarChar, req.user._id)
  //   //   .query("SELECT * [except password] from Users where _id = @_id");
  //   // .query(`ALTER TABLE ResProfile ALTER COLUMN ResID NVARCHAR(100)`);
  //   console.log(user);
  //   res.send(user.recordsets);
  // } catch (error) {
  //   console.log("dff", error);
  //   res.status(400).send(error);
  // }
});

module.exports = router;
