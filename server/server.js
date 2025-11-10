import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { adminDB } from './config/db.js';
// import { connectHotelDB } from './hotelDB.js';
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/staff", staffRoutes);
// testing...

// serve uploaded files


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// ✅ Start server only after confirming DB connection
const startServer = async () => {
  try {
    await adminDB.query('SELECT NOW()'); // test query
    console.log('✅ Connected to Admin Database');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // Stop process if DB not connected
  }
};

startServer();
