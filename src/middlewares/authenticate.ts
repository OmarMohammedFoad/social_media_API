import { NextFunction, Request, Response } from "express";
import User from "../models/users.model";
import jwt from "jsonwebtoken";
import process from "process";

interface Authenticate extends Request {
  user?: typeof User.prototype;
}
export const authenticate = async (
  req: Authenticate,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, "SecretKey") as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
