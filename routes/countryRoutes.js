const express = require("express");
const router = express.Router();

const controller = require("../controllers/countryController");

router.get("/", controller.getCountries);

module.exports = router;
