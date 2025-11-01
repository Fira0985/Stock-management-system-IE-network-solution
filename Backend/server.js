// const http = require('http');
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false, // Set to true if using https
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));

// // Define your routes here
// app.get('/api/products', async (req, res) => {
//   try {
//     const products = await prisma.product.findMany();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// // Comment out socket.io initialization so server won't create socket listeners
// const { Server } = require('socket.io');
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],}})