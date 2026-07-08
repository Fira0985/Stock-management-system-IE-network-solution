
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
