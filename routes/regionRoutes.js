const express = require("express");
const router = express.Router();

const controller = require("../controllers/regionController");

router.get("/", controller.getRegions);

module.exports = router;
