import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/messages";
import chatRoutes from "./routes/chat";
import userRoutes from "./routes/user";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);


app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);

export default app;
