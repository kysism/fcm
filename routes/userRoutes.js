const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

// ===============================
// USER REGISTER
// ===============================
router.post("/register", user.register);

// ===============================
// FCM TOKEN UPDATE
// ===============================
router.post("/token", user.registerToken);

// ===============================
// FCM TOKEN Register
// ===============================
router.get("/", user.getUserByToken);

module.exports = router;
