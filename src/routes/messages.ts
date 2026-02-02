import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { getMessages, sendMessage } from "../controllers/message";

const router = Router();

router.get("/:chatId", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);

export default router;
