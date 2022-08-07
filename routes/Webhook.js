const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatBotController");

router.post("/", chatbotController);

module.exports = router;
