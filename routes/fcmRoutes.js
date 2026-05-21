const express = require("express");
const router = express.Router();

const fcm = require("../controllers/fcmController");

router.post("/send", fcm.sendPush);
router.post("/send-topic", fcm.sendTopic);

module.exports = router;
