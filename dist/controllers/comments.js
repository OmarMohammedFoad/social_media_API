"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getComment = exports.createComment = void 0;
const comments_model_1 = __importDefault(require("../models/comments.model"));
const posts_model_1 = __importDefault(require("../models/posts.model"));
const createComment = async (req, res) => {
    try {
        const user = req.user;
        console.log(req.body, "asdsad");
        const { comment, post } = req.body;
        const newComment = await comments_model_1.default.create({
            commenter: user._id,
            comment,
            post,
        });
        await posts_model_1.default.findByIdAndUpdate(newComment.post, {
            $push: { comments: newComment._id },
        });
        res.status(201).json(newComment);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createComment = createComment;
const getComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const comment = await comments_model_1.default.findById(req.params.id).populate("commenter post");
            return res.json(comment);
        }
        const comments = await comments_model_1.default.find().populate("commenter post");
        res.json(comments);
    }
    catch (err) {
        res.status(404).json({ error: "Comment not found" });
    }
};
exports.getComment = getComment;
const updateComment = async (req, res) => {
    try {
        const updated = await comments_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        await comments_model_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Comment deleted" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteComment = deleteComment;
