"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = async () => {
    await mongoose_1.default
        .connect("mongodb://127.0.0.1:27017/social-media")
        .then(() => {
        console.log("✅ Connected to MongoDB");
    })
        .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error);
    });
};
exports.connect = connect;
