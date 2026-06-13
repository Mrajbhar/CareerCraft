import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Request Logger
app.use(
  morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res)) || 0;

    const color =
      status >= 500
        ? "red"
        : status >= 400
        ? "yellow"
        : status >= 300
        ? "cyan"
        : "green";

    return [
      chalk.gray(new Date().toLocaleTimeString()),
      chalk.bold(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      chalk[color].bold(status),
      chalk.magenta(`${tokens["response-time"](req, res)} ms`),
    ].join(" ");
  })
);

// Health Check Routes
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerCraft API is running successfully 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Connect Database & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(chalk.green.bold("✅ MongoDB Connected Successfully"));

    app.listen(PORT, () => {
      console.log(
        chalk.cyan.bold(`🚀 CareerCraft API running on port ${PORT}`)
      );
      console.log(
        chalk.yellow.bold(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
      );
    });
  })
  .catch((err) => {
    console.error(
      chalk.red.bold("❌ MongoDB Connection Error:"),
      err.message
    );
    process.exit(1);
  });

// Global Error Handlers
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
});