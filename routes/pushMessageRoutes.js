const express = require("express");
const router = express.Router();

const controller = require("../controllers/pushMessageController");

router.post("/", controller.createMessage);

router.get("/", controller.getMessages);

module.exports = router;
