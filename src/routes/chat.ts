import { Router } from "express";
import { createChat, getChatById, getUserChats } from "../controllers/chat";
import authMiddleware, { protect } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, getUserChats);

router.post("/", authMiddleware, createChat);

router.get("/:chatId", protect, getChatById);

export default router;
