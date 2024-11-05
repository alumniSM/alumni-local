import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import jobRoutes from "./routes/jobs.js";
import surveyRoutes from "./routes/surveys.js";
import dashboardRoutes from "./routes/dashboard.js";
import { initializeAdmin } from "./utils/initAdmin.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "MulterError") {
    return res
      .status(400)
      .json({ message: "File upload error", error: err.message });
  }
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    w: "majority",
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    await initializeAdmin();
    console.log("Server initialization complete");
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection error:", err);
    process.exit(1);
  });

// Error handling for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});
