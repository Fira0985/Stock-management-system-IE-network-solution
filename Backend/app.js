// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");

const app = express();

// ───────────── Middleware ─────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local testing
      "https://stock-management-system-6gkw.onrender.com" ,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

// ───────────── Create HTTP + Socket.IO Server ─────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://stock-management-system-6gkw.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", (userName) => {
    console.log(`${userName} is online`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available inside routes (optional)
app.set("io", io);

// ───────────── Start Server ─────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const router = require("./routes/route");
// const app = express();

// app.use(cors({ origin: process.env.FRONTEND_URL || "https://stock-management-system-ie-network-ten.vercel.app", credentials: true }));
// // app.use(cors({ origin: process.env.FRONTEND_URL || " http://localhost:5173/", credentials: true }));  for local purpose
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api", router);

// module.exports = app;
