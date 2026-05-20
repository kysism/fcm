const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

// ===============================
// USER FLOW
// ===============================
router.post("/register", user.register);

// device token update
router.post("/device-token", user.registerToken);

// get user by phone (APP START 핵심)
router.get("/by-phone", user.getUserByPhone);

// get user by FCM token (optional debug or admin use)
router.get("/by-token", user.getUserByToken);

// ===============================
// ADMIN / LIST
// ===============================
router.get("/", user.getUsers);

module.exports = router;
