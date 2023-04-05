const express = require("express");
const { userToken, validate } = require("../models/user");
const _ = require("lodash");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../startup/database");
const sql = require("mssql");

router.get("/", [auth], async (req, res) => {
    try {
        const pool = await db();
        const data = await pool
          .request()
          .query("SELECT * from Centers");
        res.send(data.recordset);
      } catch (error) {
        console.error(error)
        res.status(400).send(error);
      }
});

module.exports = router;
