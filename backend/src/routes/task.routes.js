import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
console.log("✅ task.routes.js LOADED");


const router = express.Router();

router.get("/test", (req, res) => {
  console.log("✅ /api/tasks/test HIT");
  res.json({ ok: true });
});

/* Apply auth ONCE */
router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
