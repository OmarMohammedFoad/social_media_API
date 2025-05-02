import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} from "../controllers/comments";
const router = Router();
import { authenticate } from "../middlewares/authenticate";

router.get("/", authenticate, getComment);
router.get("/:id", authenticate, getComment);
router.post("/", authenticate, createComment);
router.put("/:id", authenticate, updateComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
