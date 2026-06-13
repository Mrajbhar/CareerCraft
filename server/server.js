// ===> place at: server/server.js
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

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());


app.use(
  morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res)) || 0;
    const color =
      status >= 500 ? "red" :
      status >= 400 ? "yellow" :
      status >= 300 ? "cyan" : "green";
    return [
      chalk.gray(new Date().toLocaleTimeString()),
      chalk.bold(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      chalk[color].bold(status),
      chalk.magenta(`${tokens["response-time"](req, res)} ms`),
    ].join(" ");
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (_req, res) => res.send("CareerCraft API Running"));

// ---- start ----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(chalk.green.bold("✅ MongoDB Connected"));
    app.listen(PORT, () =>
      console.log(chalk.cyan.bold(`🚀 Server running on http://localhost:${PORT}`))
    );
  })
  .catch((err) =>
    console.error(chalk.red.bold("❌ MongoDB Connection Error:"), chalk.red(err.message))
  );