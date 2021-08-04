const express = require("express");
const sql = require("mssql");

const auth = require("../middleware/auth");
const db = require("../startup/database");

const admission = require("./resident/admission");
const basic = require("./resident/basic");
const contacts = require("./resident/contacts");
const drug = require("./resident/drug");
const education = require("./resident/education");
const employment = require("./resident/employment");
const family = require("./resident/family");
const finance = require("./resident/finance");
const legal = require("./resident/legal");
const medical = require("./resident/medical");
const medication = require("./resident/medication");
const notes = require("./resident/notes");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  let query = req.query;
  let ssn = query.ssn;
  let resName = query.name;

  try {
    const pool = await db();
    const poolRequest = await pool.request();

    if (ssn) poolRequest.input("SSN", sql.VarChar, ssn);
    if (resName) poolRequest.input("resName", sql.VarChar, `%${resName}%`);

    let string = `SELECT * from ResProfile
      ${ssn || resName ? "where" : ""}
      ${ssn ? "ssn = @SSN" : ""}
      ${ssn && resName ? "or" : ""}
      ${resName ? "ResFirstName like @resName" : ""}
      `;

    const data = await poolRequest.query(string);

    res.send(data.recordset);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  let resID = req.params.id;
  if (!resID) return res.status(404).send("Please provide a Resident ID!");

  try {
    let string = `SELECT * from ResProfile where ResID = @ResID`;
    const pool = await db();
    const data = await pool
      .request()
      .input("ResID", sql.NVarChar, resID)
      .query(string);

    if (!data.recordset) return res.status(404).send("Invalid Request!");

    if (data.recordset.length === 0)
      return res.status(404).send("Resident does not exist.");

    res.send(data.recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// router.use("/admission", admission);
// router.use("/basic", basic);
// router.use("/contacts", contacts);
// router.use("/drug", drug);
// router.use("/education", education);
// router.use("/employment", employment);
// router.use("/family", family);
// router.use("/finance", finance);
// router.use("/legal", legal);
// router.use("/medical", medical);
// router.use("/medication", medication);
// router.use("/notes", notes);

module.exports = router;
