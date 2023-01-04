const express = require("express");
const aws = require("./resourses/route_aws");
const router = express.Router();

router.use("/aws", aws);

module.exports = router;
