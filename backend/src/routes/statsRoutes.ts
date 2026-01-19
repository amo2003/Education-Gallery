import express from "express";
import { getStats } from "../controllers/statsController";

const router = express.Router();

// Public stats for landing page
router.get("/", getStats);

export default router;

