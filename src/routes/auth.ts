import { login, register } from "../controllers/authentication";
import { Router } from "express";
import { getUserInfo, updateUser } from "../controllers/User";
import upload from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/update-profile", authenticate, upload.single("image"), updateUser);
router.get("/profile-info", authenticate, getUserInfo);

export default router;
