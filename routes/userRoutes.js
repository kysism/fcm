const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

// ===============================
// REGISTER
// ===============================
router.post("/register", user.register);

// ===============================
// GET USER
// ===============================
router.get("/by-phone", user.getUserByPhone);
router.get("/by-token", user.getUserByToken);

// ===============================
// USER LIST
// ===============================
router.get("/list", user.getUsers);

module.exports = router;
