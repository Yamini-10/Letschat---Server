import { Response } from "express";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user?.userId }
    }).select("_id name email isOnline");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
