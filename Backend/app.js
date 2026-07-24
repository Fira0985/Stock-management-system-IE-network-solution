const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://stock-management-system-6gkw.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", router);

// Health check route (optional but recommended)
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});