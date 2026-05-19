const express = require("express");

const router = express.Router();

const region = require("../controllers/regionController");

// GET
router.get("/", region.getRegions);

// CREATE
router.post("/", region.createRegion);

// UPDATE
router.put("/:code", region.updateRegion);

// DELETE
router.delete("/:code", region.deleteRegion);

module.exports = router;
