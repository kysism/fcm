const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

// FCM token update
router.post("/token", user.registerToken);

module.exports = router;
