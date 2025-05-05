import mongoose, { Error } from "mongoose";
import postsModel from "../models/posts.model";
import usersModel from "../models/users.model";
import { Request, Response } from "express";
import { create } from "domain";
import uploadImgs from "../utils/uploadImgs";
import fs from "fs/promises";
import path from "path";

// create the crud operation of the posts
interface Authenticate extends Request {
  user?: typeof usersModel.prototype;
}

export const createPost = async (req: Authenticate, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user;

    console.log(req.body);
    console.log(req.file);

    let newImage: any;
    if (req.file?.buffer) {
      const base64Img = req.file.buffer.toString("base64");
      newImage = await uploadImgs(base64Img);
    }

    console.log(newImage);

    const newPost = await postsModel.create({
      content,
      imageUrl: newImage?.data?.data?.url,
      author: userId,
    });

    await usersModel.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    });

    const fullPost = await postsModel
      .findById(newPost._id)
      .populate("author")
      .populate("comments")
      .select("-__v");

    res.status(201).json(fullPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPost = async (req: Authenticate, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    if (id) {
      const post = await postsModel
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

    const allPosts = await postsModel
      .find()
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "commenter",
          select: "username email profileImage",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // console.log(allPosts[8].comments);

    res.status(200).json(allPosts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPostsByRelatedUser = async (
  req: Authenticate,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    if (id) {
      const post = await postsModel
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

    const allPosts = await postsModel
      .find({ author: userId })
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "commenter",
          select: "username email profileImage",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // console.log(allPosts[8].comments);

    res.status(200).json(allPosts);
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // console.log(id,"sadsa");
    
    let newImage: any;
    if (req.file?.buffer) {
      const base64Img = req.file.buffer.toString("base64");
      newImage = await uploadImgs(base64Img);
    }

    // console.log(newImage.data.data);

    if (newImage) {
      req.body.imageUrl = newImage?.data.data.url;
    }
    // console.log(req.body);
    
    const updated = await postsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error: any) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPost = await postsModel.findByIdAndDelete(id);
    return res.json(deletedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req: Authenticate, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const post = await postsModel.findById(id);

    const userObjectId = new mongoose.Types.ObjectId(user);

    const alreadyLiked = post?.likes.some(
      (like) => like.toString() === userObjectId.toString()
    );
    console.log(alreadyLiked);

    if (alreadyLiked) {
      await postsModel.findByIdAndUpdate(id, {
        $pull: { likes: userObjectId },
      });
    } else {
      await postsModel.findByIdAndUpdate(id, {
        $addToSet: { likes: userObjectId },
      });
    }
    const updatedPost = await postsModel.findById(id);
    return res.status(200).json({
      liked: !alreadyLiked,
      totalLikes: updatedPost?.likes.length || 0,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};
