const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/admins", require("./admins"));
router.use("/themes", require("./themes"));
router.use("/questions", require("./questions"));
router.use("/imports", require("./imports"));
router.use("/discussions", require("./discussions"));

module.exports = router;
