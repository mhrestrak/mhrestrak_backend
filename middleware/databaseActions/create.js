const db = require("../../startup/database");
const sql = require("mssql");
const uniqid = require("uniqid");

let tables = [
  { name: "ResProfile", path: "basic" },
  { name: "ResContacts", path: "contacts" },
  { name: "ResDrugInfo", path: "drug" },
  { name: "ResEducationInfo", path: "education" },
  { name: "ResEmployment", path: "employment" },
  { name: "ResNotes", path: "notes" },
  { name: "ResFamily", path: "family" },
  { name: "ResFinance", path: "finance" },
  { name: "ResLegalCases", path: "legal" },
  { name: "ResMedicalInfo", path: "medical" },
  { name: "ResMedicationInfo", path: "medication" },
  { name: "ResAdmission", path: "admission" },
];

module.exports = (model) => {
  return async (req, res, next) => {
    let body = req.body;
    let path = req.originalUrl;
    console.log(path);
    // let modelPath = `../../model/${path[2]}/${path[2]}_${path[3]}`;

    try {
      let updatedModel = model(body);
      // let key = "ID";
      // if (path[3] === "basic") {
      //   key = ResID;
      // }
      // updatedModel.push({
      //   key: key,
      //   value: uniqid(),
      //   type: "VarChar",
      // });
      console.log("1");
      let tableName = tables.filter(
        (table) => table.path === path.split("/")[3]
      )[0];
      let string = `INSERT INTO ${tableName.name} (`;

      const pool = await db();
      //@ts-ignore
      let poolRequest = await pool.request();

      console.log("2");
      console.log(updatedModel);
      updatedModel.forEach((Item, i) => {
        if (i == 0) {
          string = string + Item.key;
        } else {
          string = string + "," + Item.key;
        }
        poolRequest.input(Item.key, sql[Item.type], Item.value);
      });
      string = string + ") values (";
      updatedModel.forEach((Item, i) => {
        if (i == 0) {
          string = string + `@${Item.key}`;
        } else {
          string = string + "," + `@${Item.key}`;
        }
      });

      string = string + ")";
      console.log("3");
      console.log(string);

      let data = await poolRequest.query(string);
      req.data = data;
      next();
    } catch (error) {
      res.status(400).send(error);
    }
  };
};
