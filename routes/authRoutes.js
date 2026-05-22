const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController");

router.post("/generate", auth.generatePassword);
router.post("/verify", auth.verifyPassword);

module.exports = router;
