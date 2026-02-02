import { Response } from "express";
import Message from "../models/message";
import Chat from "../models/chat";
import {io} from "../server"
export const sendMessage = async (req: any, res: Response) => {
  const { chatId, content } = req.body;
  const senderId = req.user.userId;

  const message = await Message.create({
    chat: chatId,
    sender: senderId,
    content,
    status: "sent"
  });

  const populatedMessage = await message.populate(
    "sender",
    "name email"
  );

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id
  });

  // 🔥 REALTIME EMIT
  io.to(chatId).emit("new-message", populatedMessage);

  res.json(populatedMessage);
};

export const getMessages = async (req: any, res: Response) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  }).populate("sender", "name email");

  res.json(messages);
};
