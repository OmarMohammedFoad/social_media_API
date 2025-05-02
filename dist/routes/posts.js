"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_1 = require("../controllers/posts");
const router = (0, express_1.Router)();
const authenticate_1 = require("../middlewares/authenticate");
const upload_1 = __importDefault(require("../middlewares/upload"));
router.put("/:id/like-post", authenticate_1.authenticate, posts_1.likePost);
router.post("/", authenticate_1.authenticate, upload_1.default.single("image"), posts_1.createPost);
router.get("/", authenticate_1.authenticate, posts_1.getAllPost);
router.get("/user-posts", authenticate_1.authenticate, posts_1.getAllPostsByRelatedUser);
router.get("/:id", authenticate_1.authenticate, posts_1.getAllPost);
router.get("/related/:id", authenticate_1.authenticate, posts_1.getAllPostsByRelatedUser);
router.put("/:id", authenticate_1.authenticate, upload_1.default.single("image"), posts_1.updatePost);
router.delete("/:id", authenticate_1.authenticate, posts_1.deletePost);
exports.default = router;
