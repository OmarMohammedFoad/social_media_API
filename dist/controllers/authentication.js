"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await users_model_1.default.create({
            ...req.body,
            password: hashedPassword,
        });
        return res.status(200).json({
            user: {
                id: newUser._id,
                name: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        "{{$randomLoremWord}}";
        const { email, password } = req.body;
        const user = await users_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "SecretKey");
        return res.status(200).json({
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                imgProfile: user.profileImage,
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Error " });
    }
};
exports.login = login;
const logout = async (req, res) => { };
