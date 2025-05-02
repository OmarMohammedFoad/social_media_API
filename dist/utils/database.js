"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connect = async () => {
    console.log("data connecteddd");
    await mongoose_1.default
        .connect(`${process.env.MONGO_URL}`)
        .then(() => {
        console.log("✅ Connected to MongoDB");
    })
        .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error);
    });
};
exports.connect = connect;
