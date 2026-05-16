const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

router.post("/register-token", user.registerToken);

module.exports = router;
