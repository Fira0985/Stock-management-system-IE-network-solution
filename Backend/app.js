// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");

const app = express();

// ───────────── Middleware ─────────────
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://stock-management-system-6gkw.onrender.com" // deployed frontend
];

function isOriginAllowed(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }
  // Allow Vercel preview/production domains for this project
  if (
    origin.startsWith("https://stock-management-system-ie-network-solution") &&
    origin.endsWith(".vercel.app")
  ) {
    callback(null, true);
    return;
  }
  callback(new Error("CORS not allowed"));
}

// CORS for REST API
app.use(
  cors({
    origin: isOriginAllowed,
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.json({ message: "Stock Management System API is running successfully." });
});
app.use("/api", router);


// ───────────── Create HTTP + Socket.IO Server ─────────────
const server = http.createServer(app);

// Socket.IO with dynamic CORS handling
const io = new Server(server, {
  cors: {
    origin: isOriginAllowed,
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
