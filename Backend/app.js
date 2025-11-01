// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");

const app = express();

// ───────────── Middleware ─────────────
// CORS for REST API
app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // local frontend
        "https://stock-management-system-6gkw.onrender.com" // deployed frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

// ───────────── Create HTTP + Socket.IO Server ─────────────
const server = http.createServer(app);

// Socket.IO with dynamic CORS handling
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://stock-management-system-6gkw.onrender.com"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ───────────── Socket.IO Events ─────────────
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", (userName) => {
    console.log(`${userName} is online`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available inside routes if needed
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
