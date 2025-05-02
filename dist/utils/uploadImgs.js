"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadImgs;
const axios_1 = __importDefault(require("axios"));
async function uploadImgs(img) {
    console.log("assssssssssssssssssssssssssss", img);
    try {
        if (!img)
            throw new Error("No image provided");
        const formData = new FormData();
        formData.append("image", img);
        console.log("asssssssssssssssssssssssssssssssssssssssssssssss");
        const res = await axios_1.default.post("https://api.imgbb.com/1/upload", formData, {
            params: {
                key: "4fea2399129982d02aab402b46c1ba59",
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(res);
        return res; // contains { url, etc. }
    }
    catch (error) {
        console.log("sssssssssssssss", error);
        console.error("Upload error:", error.response?.data || error.message);
        throw new Error(`Error while uploading image: ${error.message}`);
    }
}
