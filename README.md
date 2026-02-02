# LetsChat – Server (Backend)

Backend of the LetsChat real-time chat application built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

Handles authentication, chats, messages, online/offline status, and message delivery logic.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication

---

## Features

- User login & registration
- JWT authentication
- One-to-one chat
- Online / Offline presence
- Last seen support
- Message status handling:
  - Sent
  - Delivered
  - Seen
- Multi-tab & multi-browser support

---

## Environment Variables

Create `.env` inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/letschat
JWT_SECRET=your_secret_key
