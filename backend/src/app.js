import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import taskRoutes from "./routes/task.routes.js";




const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tasks", taskRoutes);


// Test API
app.get("/", (req, res) => {
  res.json({ message: "Smart Task API is running 🚀" });
});

export default app;
