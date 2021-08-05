const express = require("express");
const {
  validate: validateReturn,
} = require("../../models/resident/resident_basic");
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isIntakeCoordinator = require("../../middleware/isIntakeCoordinator");
const db = require("../../startup/database");
const sql = require("mssql");
const uniqid = require("uniqid");

router.post(
  "/",
  [auth, isIntakeCoordinator, validate(validateReturn)],
  async (req, res) => {
    let data = req.body;
    try {
      const pool = db();
      user = await pool
        .request()
        .input("_id", sql.VarChar, req.user._id)
        .query("SELECT * from Users where _id = @_id");
    } catch (error) {
      res.status(400).send(error);
    }

    console.log(user);

    if (user) return res.status(400).send("User alrseady registered..");

    user = _.pick(req.body, [
      "name",
      "email",
      "password",
      "isAdmin",
      "isIntakeCoordinator",
    ]);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
      const pool = db();
      const addedUser = await pool
        .request()
        .input("name", sql.NVarChar, user.name)
        .input("email", sql.NVarChar, user.email)
        .input("password", sql.NVarChar, user.password)
        .input("isAdmin", sql.Bit, user.isAdmin ? 1 : 0)
        .input("isIntakeCoordinator", sql.Bit, user.isIntakeCoordinator ? 1 : 0)
        .query(
          "INSERT INTO Users (email,password,isAdmin, isIntakeCoordinator)"
        );

      console.log(addedUser.recordsets);
      const token = userToken(addedUser.recordsets);
      res.header("x-auth-token", token).send(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = router;
