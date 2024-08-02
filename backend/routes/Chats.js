const express = require("express");
const { createChat , fetchChat,fetchChats, delChat,addPrompt, fetchMessages, updateChatTitle} = require("../controllers/Chats");
const router = express.Router();

router.post("/createChat", createChat)
router.get("/fetchChat/:uid/:chatId", fetchChat)
router.get("/fetchMessages/:uid/:chatId", fetchMessages)
router.get("/fetchChats/:uid" , fetchChats)
router.delete("/delChat", delChat)
router.put("/addPrompt/:id", addPrompt)
router.put("/chattitlechange/:id", updateChatTitle)

exports.router = router;