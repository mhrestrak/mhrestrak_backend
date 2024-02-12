const { getRightTime } = require("../../services/dateHelpers");
const db = require("../../startup/database");
const sql = require("mssql");

let tables = [
  { name: "ResProfile", path: "basic",id : "ResID" },
  { name: "ResContacts", path: "contacts",id : "ID" },
  { name: "ResDrugInfo", path: "drug",id : "ID" },
  { name: "ResEducationInfo", path: "education",id : "ID" },
  { name: "ResEmployment", path: "employment",id : "ID" },
  { name: "ResNotes", path: "notes",id : "ID" },
  { name: "ResFamily", path: "family",id : "ID" },
  { name: "ResFinance", path: "finance",id : "ID" },
  { name: "ResLegalCases", path: "legal",id : "ID" },
  { name: "ResMedicalInfo", path: "medical",id : "ID" },
  { name: "ResMedicationInfo", path: "medication",id : "ID" },
  { name: "ResAllergies", path: "allergies",id : "ID" },
  { name: "ResAdmission", path: "admission", id : "AdmissionID" },
];

module.exports = (model) => {
  return async (req, res, next) => {
    let body = req.body;
    let path = req.originalUrl;
    console.log(path);
    // return next()
    // let modelPath = `../../model/${path[2]}/${path[2]}_${path[3]}`;

    try {
      let updatedModel = model(body);

      console.log("1");
      let tableName = tables.filter(
        (table) => table.path === path.split("/")[3]
      )[0];
      let string = `UPDATE ${tableName.name} SET `;

      const pool = await db();
      //@ts-ignore
      let poolRequest = await pool.request();

      console.log("2");
      console.log(updatedModel);
      updatedModel.forEach((Item, i) => {
        if (i == 0) {
          string = string + Item.key+"=@"+Item.key;
        } else {
          string = string + "," + Item.key+"=@"+Item.key;
        }
        if(Item.type === "Date") Item.value = getRightTime(Item.value)
        poolRequest.input(Item.key, sql[Item.type], Item.value);
      });
      poolRequest.input("identifier", sql.VarChar, body[tableName.id]);
      string = string + ` where  ${tableName.id}=@identifier`;

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
