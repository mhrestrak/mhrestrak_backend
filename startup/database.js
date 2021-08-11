const sql = require("mssql");
const config = require("config");

var DbConfig = {
  server: config.get("dbServer"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get("db"),
};

module.exports = async function () {
  //-----------------------connecting mongo db---------------------------
  try {
    let pool = await sql.connect(DbConfig);
    console.log("Connection established.");
    return pool;
  } catch (err) {
    console.log("Connection Failed!!!");
    console.log(err);
    return { error: err.message };
  }

  //   pool.request().query("SELECT * from ResProfile");
  //   console.log(products);
};
// const winston = require("winston");
