const express = require("express");
const router = express.Router();

const region = require("../controllers/regionController");

router.get("/", region.getRegions);
router.post("/", region.createRegion);
router.put("/:id", region.updateRegion);
router.delete("/:id", region.deleteRegion);

router.get("/check", region.checkRegionCode);

module.exports = router;
