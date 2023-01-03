const sql = require("mssql");
const config = require("config");
const HttpProxyAgent = require('http-proxy-agent');

var DbConfig = {
  server: config.get("dbServer"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get("db"),
};

module.exports = async function () {
  //-----------------------connecting mongo db---------------------------
  console.log(1, process.env.QUOTAGUARDSTATIC_URL)
  const agent = new HttpProxyAgent(process.env.QUOTAGUARDSTATIC_URL);

  try {
    let pool = new sql.ConnectionPool({
      server: config.get("dbServer"),
      user: config.get("dbUser"),
      password: config.get("dbPassword"),
      database: config.get("db"),
      options : {
        encrypt : true,
        agent
      }
    });
    pool = await pool.connect()
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
