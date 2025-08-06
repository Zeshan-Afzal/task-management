import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./tasks_controller.js";
import { authMiddleware } from "../../middlewares/check_token.js";

const router = express.Router();

router.post("/create", authMiddleware, createTask);

router.get("/get-tasks", authMiddleware, getTasks);

router.get("/get-task/:id", authMiddleware, getTaskById);

router.put("/update-task/:taskId", authMiddleware, updateTask);

router.delete("/delete-task/:id", authMiddleware, deleteTask);

export default router;
