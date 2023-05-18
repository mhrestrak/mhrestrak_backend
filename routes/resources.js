const express = require("express");
const aws = require("./resourses/route_aws");
const verify = require("./route_EmailVerification");
const router = express.Router();

router.use("/aws", aws);

router.get("/ping", async (req, res) => {
    res.send();
});

module.exports = router;
