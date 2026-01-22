import express from "express";
import {register , login, getProfile, getAllUsers, googleLogin, deleteProfile, updateProfile } from "../controllers/authControllers"
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/updateProfile", protect, updateProfile);
router.delete("/deleteProfile", protect, deleteProfile);
router.get("/users", protect, getAllUsers);
router.post("/google", googleLogin);


export default router;