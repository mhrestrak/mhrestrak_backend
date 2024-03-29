const express = require("express");
const sql = require("mssql");

const auth = require("../middleware/auth");
const { generateObjectUrl } = require("../services/aws");
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
const allergies = require("./resident/allergies");
const notes = require("./resident/notes");
const level1Access = require("../middleware/level1Access");

const router = express.Router();

router.use("/basic", basic);
router.use("/admission", admission);
router.use("/contacts", contacts);
router.use("/drug", drug);
router.use("/education", education);
router.use("/employment", employment);
router.use("/family", family);
router.use("/finance", finance);
router.use("/legal", legal);
router.use("/medical", medical);
router.use("/medication", medication);
router.use("/allergies", allergies);
router.use("/notes", notes);


router.get("/", [auth, level1Access], async (req, res) => {
  let { query, active } = req.query;
  console.log(query, active);
  try {
    const pool = await db();
    //@ts-ignore
    const poolRequest = await pool.request();

    const  formatString = (input) => {
      if (input.length <= 3) {
          return input;
      } else if (input.length <= 5) {
          return input.slice(0, 3) + '-' + input.slice(3);
      } else {
          return input.slice(0, 3) + '-' + input.slice(3, 5) + '-' + input.slice(5, 9);
      }
    }

    if (query) {
      poolRequest.input("query", sql.VarChar, query);
      poolRequest.input("formatedQuery", sql.VarChar, formatString(query));
    }

    let string = `SELECT * from ResProfile ${
      query
        ? "where (ssn = @query or ssn like @formatedQuery or ResFirstName like @query or ResLastName like @query)"
        : ""
    }`;
    switch (active) {
      case "2":
        poolRequest.input("active", sql.Bit, true);
        string = string + (query ? " and" : " where");
        string = `${string} IsActive=@active`;
        break;
      case "3":
        poolRequest.input("active", sql.Bit, false);
        string = string + (query ? " and" : " where");
        string = `${string} IsActive=@active`;
        break;
    }
    console.log(string);
    const data = await poolRequest.query(string);
    console.log(data);
    let admissions = await getAdmissions();
    data.recordset.forEach((resident, index) =>{
      let count = 0
      admissions.forEach((add) =>{
          if(add.ResID === resident.ResID) count = count+1
      })
      data.recordset[index].admissions = count
    })

    if (!req.user.isAdmin) {
      let filtered = data.recordset.filter(
        (resident) => resident.Center === req.user.Center
      );
      return res.send(filtered);
    }
    res.send(data.recordset);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

router.get("/:id", [auth, level1Access], async (req, res) => {
  let resID = req.params.id;
  if (!resID) return res.status(404).send("Please provide a Resident ID!");

  try {
    let string = `SELECT * from ResProfile where ResID = @ResID`;
    const pool = await db();
    //@ts-ignore
    const data = await pool
      .request()
      .input("ResID", sql.NVarChar, resID)
      .query(string);

    if (!data.recordset) return res.status(404).send("Invalid Request!");
    if (data.recordset.length === 0)
      return res.status(404).send("Resident does not exist.");
    let resident = data.recordset[0];

    if (resident.ResPictureKey) {
      if (resident.ResPictureKey.startsWith("ImgKey_")) {
        resident.ResPictureKey = generateObjectUrl(resident.ResPictureKey);
      }
    }
    res.send(data.recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Database connection");
  }
});

const getAdmissions = async () => {
  const pool = await db();
  const poolRequest = await pool.request();
  let query = `SELECT * from ResAdmission`;
  let data = await poolRequest.query(query);
  return data.recordset;
};

module.exports = router;
