const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

router.post("/register", user.register);
router.get("/by-phone", user.getUserByPhone);
router.get("/by-token", user.getUserByToken);

module.exports = router;
