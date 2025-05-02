import Comment from "../models/comments.model";
import Post from "../models/posts.model";
import { Request, Response } from "express";
import usersModel from "../models/users.model";

interface Authenticate extends Request {
  user?: typeof usersModel.prototype;
}
export const createComment = async (req: Authenticate, res: Response) => {
  try {
    const user = req.user;
    console.log(req.body,"asdsad");
    const { comment, post } = req.body;
    
    const newComment = await Comment.create({
      commenter: user._id,
      comment,
      post,
    });

    await Post.findByIdAndUpdate(newComment.post, {
      $push: { comments: newComment._id },
    });
    res.status(201).json(newComment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id) {
      const comment = await Comment.findById(req.params.id).populate(
        "commenter post"
      );
      return res.json(comment);
    }
    const comments = await Comment.find().populate("commenter post");
    res.json(comments);
  } catch (err) {
    res.status(404).json({ error: "Comment not found" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
