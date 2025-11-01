const express = require("express");
const { Server } = require("socket.io");
const app = express();
const router = require("./routes/route");
const cors = require("cors");
const path = require("path");

app.use(
  cors({
    origin: "https://stock-management-system-ie-network-ten.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

/* ───────────── Socket.IO Config ───────────── */
let io;

// Socket.IO initialization function
const initSocketIO = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "https://stock-management-system-ie-network-ten.vercel.app",
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

    app.set("io", io);
  }
  return io;
};

// Export for Vercel serverless
module.exports = (req, res) => {
  // Initialize Socket.IO when needed
  if (!res.socket.server.io) {
    initSocketIO(res.socket.server);
  }
  
  // Handle the request with Express
  return app(req, res);
};


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
