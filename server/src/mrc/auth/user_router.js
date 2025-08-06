import express from "express";
import {
  loginUser,
  signUp,
  logout,
  updateUser,
  updatePassword,
  updateEmail,
} from "./user_controller.js";
import { authMiddleware } from "../../middlewares/check_token.js";

const router = express.Router();

router.post("/sign_up", signUp);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);
router.put("/update", authMiddleware, updateUser);
router.put("/update-password", authMiddleware, updatePassword);
router.put("/update-email", authMiddleware, updateEmail);

export default router;
