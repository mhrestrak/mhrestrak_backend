const db = require("../../startup/database");
const sql = require("mssql");
const uniqid = require("uniqid");

let tables = [
  { name: "ResProfile", path: "basic" },
  { name: "ResContacts", path: "contacts" },
  { name: "ResDrugInfo", path: "drug" },
  { name: "ResEducationInfo", path: "education" },
  { name: "ResEmployment", path: "employment" },
  { name: "ResFamily", path: "family" },
  { name: "ResFinance", path: "finance" },
  { name: "ResLegalCases", path: "legal" },
  { name: "ResMedicalInfo", path: "medical" },
  { name: "ResMedicationInfo", path: "medication" },
];

module.exports = (model) => {
  return async (req, res, next) => {
    let body = req.body;
    let path = req.originalUrl;
    // let modelPath = `../../model/${path[2]}/${path[2]}_${path[3]}`;

    try {
      let contactInfoModel = model(body);
      let key = "ID";
      if (path[3] === "basic") {
        key = ResID;
      }
      contactInfoModel.push({
        key: key,
        value: uniqid(),
        type: "VarChar",
      });
      let tableName = tables.filter((table) => table.path === path[3])[0];
      let string = `INSERT INTO ${tableName} (`;

      const pool = await db();
      let poolRequest = await pool.request();

      basicInfoModel.forEach((Item, i) => {
        if (i == 0) {
          string = string + Item.key;
        } else {
          string = string + "," + Item.key;
        }
        if (Item.type === "Bit") {
          poolRequest.input(
            Item.key,
            sql[Item.type],
            Item.value === true ? 1 : 0
          );
        } else {
          poolRequest.input(Item.key, sql[Item.type], Item.value);
        }
      });
      string = string + ")";

      let data = await poolRequest.query(string);
      req.data = data;
      next();
    } catch (error) {
      res.status(400).send(error);
    }
  };
};
