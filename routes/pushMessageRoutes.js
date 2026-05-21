const express = require("express");

const router = express.Router();

const controller = require("../controllers/pushMessageController");

router.post("/", controller.createMessage);

module.exports = router;
