"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
const express_1 = require("express");
const User_1 = require("../controllers/User");
const upload_1 = __importDefault(require("../middlewares/upload"));
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
router.post("/login", authentication_1.login);
router.post("/register", authentication_1.register);
router.put("/update-profile", authenticate_1.authenticate, upload_1.default.single("image"), User_1.updateUser);
router.get("/profile-info", authenticate_1.authenticate, User_1.getUserInfo);
exports.default = router;
