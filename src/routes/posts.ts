import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  updatePost,
  getAllPostsByRelatedUser,
  likePost,
} from "../controllers/posts";
const router = Router();
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/upload";
router.put("/:id/like-post", authenticate, likePost);

router.post("/", authenticate, upload.single("image"), createPost);
router.get("/", authenticate, getAllPost);
router.get("/user-posts", authenticate, getAllPostsByRelatedUser);
router.get("/:id", authenticate, getAllPost);
router.get("/related/:id", authenticate, getAllPostsByRelatedUser);
router.put("/:id", authenticate, upload.single("image"), updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
