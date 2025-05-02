"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.deletePost = exports.updatePost = exports.getAllPostsByRelatedUser = exports.getAllPost = exports.createPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const uploadImgs_1 = __importDefault(require("../utils/uploadImgs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user;
        console.log(req.body);
        console.log(req.file);
        let newImage;
        if (req.file?.filename) {
            const imagePath = path_1.default.join(__dirname, "../../uploads/posts", req.file.filename);
            try {
                const imageBuffer = await promises_1.default.readFile(imagePath);
                const base64Img = imageBuffer.toString("base64");
                newImage = await (0, uploadImgs_1.default)(base64Img); // Now passing base64
            }
            finally {
                await promises_1.default.rm(imagePath).catch(() => { });
            }
        }
        console.log(newImage);
        const newPost = await posts_model_1.default.create({
            content,
            imageUrl: newImage?.data.data.url,
            author: userId,
        });
        await users_model_1.default.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id },
        });
        const fullPost = await posts_model_1.default
            .findById(newPost._id)
            .populate("author")
            .populate("comments")
            .select("-__v");
        res.status(201).json(fullPost);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPost = createPost;
const getAllPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const post = await posts_model_1.default
                .findById(id)
                .populate("author")
                .populate({
                path: "comments",
                populate: {
                    path: "commenter",
                    select: "username email profileImage",
                },
            });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(200).json(post);
        }
        const allPosts = await posts_model_1.default
            .find()
            .populate("author")
            .populate({
            path: "comments",
            populate: {
                path: "commenter",
                select: "username email profileImage",
            },
        })
            .sort({ createdAt: -1 });
        // console.log(allPosts[8].comments);
        res.status(200).json(allPosts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllPost = getAllPost;
const getAllPostsByRelatedUser = async (req, res) => {
    try {
        console.log("asdasdas");
        const { id } = req.params;
        const userId = req.user;
        console.log(userId);
        if (id) {
            const post = await posts_model_1.default
                .findById({})
                .populate("author")
                .populate({
                path: "comments",
                populate: {
                    path: "commenter",
                    select: "username email profileImage",
                },
            });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(200).json(post);
        }
        const allPosts = await posts_model_1.default
            .find({ author: userId })
            .populate("author")
            .populate({
            path: "comments",
            populate: {
                path: "commenter",
                select: "username email profileImage",
            },
        })
            .sort({ createdAt: -1 });
        // console.log(allPosts[8].comments);
        res.status(200).json(allPosts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
exports.getAllPostsByRelatedUser = getAllPostsByRelatedUser;
const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        let newImage;
        if (req.file?.filename) {
            const imagePath = path_1.default.join(__dirname, "../../uploads/posts", req.file.filename);
            try {
                const imageBuffer = await promises_1.default.readFile(imagePath);
                const base64Img = imageBuffer.toString("base64");
                newImage = await (0, uploadImgs_1.default)(base64Img); // Now passing base64
            }
            finally {
                await promises_1.default.rm(imagePath).catch(() => { });
            }
        }
        console.log(newImage.data.data);
        if (newImage) {
            req.body.imageUrl = newImage?.data.data.url;
        }
        const updated = await posts_model_1.default.findByIdAndUpdate(postId, req.body, {
            new: true,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await posts_model_1.default.findByIdAndDelete(id);
        return res.json(deletedPost);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deletePost = deletePost;
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const post = await posts_model_1.default.findById(id);
        const userObjectId = new mongoose_1.default.Types.ObjectId(user);
        const alreadyLiked = post?.likes.some((like) => like.toString() === userObjectId.toString());
        console.log(alreadyLiked);
        if (alreadyLiked) {
            await posts_model_1.default.findByIdAndUpdate(id, {
                $pull: { likes: userObjectId },
            });
        }
        else {
            await posts_model_1.default.findByIdAndUpdate(id, {
                $addToSet: { likes: userObjectId },
            });
        }
        const updatedPost = await posts_model_1.default.findById(id);
        return res.status(200).json({
            liked: !alreadyLiked,
            totalLikes: updatedPost?.likes.length || 0,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.likePost = likePost;
