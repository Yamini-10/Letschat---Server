import { Router } from "express";
import { getAllUsers } from "../controllers/user";
import authMiddleware from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, getAllUsers);

export default router;
