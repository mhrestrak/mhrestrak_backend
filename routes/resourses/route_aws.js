const express = require("express");
const auth = require("../../middleware/auth");

const { generatePreSignedUploadUrl, deleteAwsObject } = require("../../services/aws");

const router = express.Router();

router.get("/uploadUrl/:fileName", [auth], async (req, res) => {
    const fileName = req.params.fileName;
    const fileType = req.query.type;
    try {
        const uploadRes = await generatePreSignedUploadUrl(fileName, fileType);
        return res.status(200).send(uploadRes);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.put("/deleteFile", [auth], async (req, res) => {
    const fileName = req.body.fileName;
    try {
        const deleteRes = await deleteAwsObject(fileName);
        console.log(deleteRes);
        return res.status(200).send("Deleted");
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

module.exports = router;