const sql = require("mssql");
const config = require("config");

var config = {
  server: config.get("dbServer"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get("db"),
};

module.exports = async function () {
  //-----------------------connecting mongo db---------------------------
  return await sql
    .connect(config)
    .then((pool) => {
      console.log("Connection established.");
      return pool;
    })
    .catch((err) => {
      console.log("!!! Cannot connect !!! Error:");
      throw err;
    });

  //   pool.request().query("SELECT * from ResProfile");
  //   console.log(products);
};
// const winston = require("winston");
