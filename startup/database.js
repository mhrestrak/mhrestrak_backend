const sql = require("mssql");
const HttpProxyAgent = require('http-proxy-agent');
const config = require("config");


const ProxyUrl = config.get("FIXIE_URL")
const agent = new HttpProxyAgent(ProxyUrl);

var DbConfig = {
  server: config.get("dbServer"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get("db"),
  options: {
    encrypt: true,
    agent: agent
  }
};

module.exports = async function () {
  //-----------------------connecting mongo db---------------------------
  try {
    const pool = new sql.ConnectionPool(DbConfig)
    console.log("Connection established.");
    return pool;
  } catch (err) {
    console.log("Connection Failed!!!");
    console.log(err);
    return { error: err.message };
  }
};
