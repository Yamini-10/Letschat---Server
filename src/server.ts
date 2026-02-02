import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import User from "./models/user";
import Chat from "./models/chat";
import Message from "./models/message";
import cors from "cors";
import { Server, Socket } from "socket.io";

dotenv.config();
connectDB();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

/**
 * userId -> Set<socketId>
 */
const onlineUsers = new Map<string, Set<string>>();

io.on("connection", (socket: Socket) => {
  console.log("Socket connected:", socket.id);

  /* ================= SETUP ================= */
  socket.on("setup", async (userId: string) => {
    console.log("SETUP:", userId);

    let sockets = onlineUsers.get(userId);
    if (!sockets) {
      sockets = new Set();
      onlineUsers.set(userId, sockets);
    }

    sockets.add(socket.id);
    socket.join(userId);

    /* SEND EXISTING ONLINE USERS TO THIS USER */
    for (const uid of onlineUsers.keys()) {
      if (uid !== userId) {
        socket.emit("user-online", uid);
      }
    }

    /* MARK ONLINE ONLY ON FIRST SOCKET */
    if (sockets.size === 1) {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: null,
      });

      socket.broadcast.emit("user-online", userId);
    }
  });

  /* ================= JOIN CHAT ================= */
  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
  });

  /* ================= NEW MESSAGE ================= */
  socket.on("new-message", async (msg) => {
    const chat = await Chat.findById(msg.chat);
    if (!chat) return;

    for (const uid of chat.users) {
      const receiverId = uid.toString();
      if (receiverId === msg.sender._id.toString()) continue;

      const sockets = onlineUsers.get(receiverId);

      if (sockets && sockets.size > 0) {
        io.to(receiverId).emit("message-received", msg);

        await Message.findByIdAndUpdate(msg._id, {
          status: "delivered",
        });

        io.to(msg.sender._id.toString()).emit(
          "message-status-updated",
          {
            messageId: msg._id,
            status: "delivered",
          }
        );
      }
    }
  });

  /* ================= CHAT OPENED ================= */
  socket.on("chat-opened", async ({ chatId, userId }) => {
    const unseen = await Message.find({
      chat: chatId,
      sender: { $ne: userId },
      status: { $ne: "seen" },
    });

    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        status: { $ne: "seen" },
      },
      { status: "seen" }
    );

    unseen.forEach((msg) => {
      io.to(msg.sender.toString()).emit("message-status-updated", {
        messageId: msg._id,
        status: "seen",
      });
    });
  });

  /* ================= LOGOUT ================= */
  socket.on("logout", async (userId: string) => {
    console.log("LOGOUT:", userId);

    const sockets = onlineUsers.get(userId);
    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      socket.broadcast.emit("user-offline", userId);
    }

    socket.disconnect(true);
  });

  /* ================= DISCONNECT ================= */
  socket.on("disconnect", async () => {
    console.log("DISCONNECT:", socket.id);

    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          socket.broadcast.emit("user-offline", userId);
        }
        break;
      }
    }
  });
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

server.listen(5000, () =>
  console.log("Server running on port 5000")
);
