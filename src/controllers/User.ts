import usersModel from "../models/users.model";
import User from "../models/users.model";
import { Request, Response } from "express";
import uploadImgs from "../utils/uploadImgs";
import path from "path";
import fs from "fs/promises";
interface Authenticate extends Request {
  user?: typeof usersModel.prototype;
}
export const updateUser = async (req: Authenticate, res: Response) => {
  try {
    const userId = req.user;
    const updates = req.body;

    // console.log(req.body);
    if (req.file) {
      try {
        const base64Img = req.file.buffer.toString("base64");
        const newImage = await uploadImgs(base64Img);

        if (newImage?.data.data.url) {
          updates.profileImage = newImage.data.data.url;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const getUserInfo = async (req: Authenticate, res: Response) => {
  try {
    const userId = req.user;
    // console.log(userId);

    const user = await User.findById(userId);
    // console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};
