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
    { name: "ResAdmission", path: "admission", id : "AdmissionID" },
  ];

module.exports = () => {
  return async (req, res, next) => {
    let path = req.originalUrl;
    let id = req.params.id

    try {
      let tableName = tables.filter((table) => table.path === path.split("/")[3])[0];
      const pool = await db();
      //@ts-ignore
      let poolRequest = await pool.request();
      poolRequest.input("ID", sql["VarChar"], id);
      let string = `DELETE FROM ${tableName.name} where ${tableName.id}=@ID`;
      let data = await poolRequest.query(string);
      req.data = data;
      next();
    } catch (error) {
      res.status(400).send(error);
    }
  };
};
