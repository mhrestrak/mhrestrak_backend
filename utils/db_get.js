const db = require("../startup/database");
const sql = require("mssql");

async function getItemById(database, IDKey, varType, ID) {
  const response = {
    found: false,
    data: undefined,
  };
  try {
    let string = `SELECT * from ${database} where ${IDKey} = @ID`;
    const pool = await db();
    //@ts-ignore
    const data = await pool.request().input("ID", sql[varType], ID).query(string);
    console.log(1)
    if (!data.recordset) return response;
    if (data.recordset.length === 0) return response;
    response.data = data.recordset[0];
    response.found = true;
    console.log(2)
    return response;
  } catch (error) {
    console.log(error)
    return response;
  }
}

module.exports = getItemById