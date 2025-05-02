"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.updateUser = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const uploadImgs_1 = __importDefault(require("../utils/uploadImgs"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const updateUser = async (req, res) => {
    try {
        const userId = req.user;
        const updates = req.body;
        let newImage;
        console.log(req.body);
        if (req.file?.filename) {
            const imagePath = path_1.default.join(__dirname, "../../uploads/posts", req.file.filename);
            // console.log(imagePath);
            // try {
            console.log(imagePath, "imagePath");
            try {
                const imageBuffer = await promises_1.default.readFile(imagePath);
                const base64Img = imageBuffer.toString("base64");
                newImage = await (0, uploadImgs_1.default)(base64Img);
            }
            finally {
                await promises_1.default.rm(imagePath).catch(() => { });
            }
            if (newImage?.data.data.url) {
                updates.profileImage = newImage.data.data.url;
            }
        }
        const updatedUser = await users_model_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user;
        // console.log(userId);
        const user = await users_model_1.default.findById(userId);
        // console.log(user);
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};
exports.getUserInfo = getUserInfo;
