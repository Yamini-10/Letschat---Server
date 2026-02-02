import { Response } from "express";
import Chat from "../models/chat";

export const createChat = async (req: any, res: Response) => {
  const { to_userId } = req.body;

  if (!to_userId) {
    return res.status(400).json({ message: "To UserId required" });
  }

  let chat = await Chat.findOne({
    users: { $all:[req.user.userId, to_userId] },
  });

  if (!chat) {
    chat = await Chat.create({
      users: [req.user.userId, to_userId],
    });
  }

  res.json(chat);
};

export const getUserChats = async (req: any, res: Response) => {
  const chats = await Chat.find({
    users: {$in: req.user.userId},
  })
    .populate("users", "name email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.json(chats);
};

export const getChatById = async (req: any, res: any) => {
  const chat = await Chat.findById(req.params.chatId)
    .populate("users", "name isOnline lastSeen");

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(chat);
};
