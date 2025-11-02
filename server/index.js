import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./db/db.js";
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Nidhibook server");
});

app.use("/api", userRoutes);
app.use("/api", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("✅ Server is running on port 5000");
});
