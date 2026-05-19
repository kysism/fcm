const express = require("express");
const router = express.Router();

const country = require("../controllers/countryController");

// READ
router.get("/", country.getCountries);

// CREATE
router.post("/", country.createCountry);

// UPDATE
router.put("/:code", country.updateCountry);

// DELETE
router.delete("/:code", country.deleteCountry);

module.exports = router;
