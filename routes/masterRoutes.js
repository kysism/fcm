const express = require("express");
const router = express.Router();
const controller = require("../controllers/masterController");

router.get("/:table", controller.getMasterData);

module.exports = router;
