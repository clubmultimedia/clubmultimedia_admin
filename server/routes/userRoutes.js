import express from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUsersByBatch,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, uploadMiddleware.single("photo"), createUser);
router.put("/edituser/:id", authMiddleware, uploadMiddleware.single("photo"), editUser);
router.delete("/deleteuser/:id", authMiddleware, deleteUser);
router.get("/getalluser", getAllUsers);
router.get("/batch/:batch", getUsersByBatch);

export default router;
