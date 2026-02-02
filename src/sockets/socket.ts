import { Server } from "socket.io";
import http from "http";

export const initSocket = (server: any) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Joined chat room: ${chatId}`);
    });

    socket.on("typing", ({ chatId, user }) => {
      socket.to(chatId).emit("typing", user);
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
  return io;
};
