const express = require("express");
const router = express.Router();

router.use("/", require("./chat"));

module.exports = router;
