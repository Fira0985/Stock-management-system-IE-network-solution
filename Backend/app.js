// const express = require("express");
// const http = require("http");              
// const { Server } = require("socket.io");   
// const app = express();
// const router = require("./routes/route");
// const cors = require("cors");
// const path = require("path");

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api", router); // base path

// /* ───────────── Socket.IO Config ───────────── */
// const server = http.createServer(app); 
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true, // ✅ add this
//   },
// });

// // Example listener
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("registerUser", (userName) => {
//     console.log(`${userName} is online`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// //  Make `io` accessible in controllers via app.get("io")
// app.set("io", io);

// /* ───────────── Server Start ───────────── */
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "https://stock-management-system-ie-network-ten.vercel.app", credentials: true }));
// app.use(cors({ origin: process.env.FRONTEND_URL || " http://localhost:5173/", credentials: true }));  for local purpose
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

module.exports = app;
