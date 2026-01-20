import express from "express";
import {
  uploadPdf,
  getAllPdfs,
  downloadPdf,
  getPdfById,
  updatePdf,
  deletePdf,
} from "../controllers/pdfController";

import { protect } from "../middleware/authMiddleware";
import { isTeacher } from "../controllers/authControllers";
import { uploadPdf as uploadMiddleware } from "../middleware/uploads";

const router = express.Router();

// ================== PUBLIC TO LOGGED USERS ==================
router.get("/", protect, getAllPdfs);
router.get("/download/:id", protect, downloadPdf);
router.get("/:id", protect, isTeacher, getPdfById);

// ================== TEACHER ONLY ==================
router.post(
  "/upload",
  protect,
  isTeacher,
  uploadMiddleware.single("pdf"),
  uploadPdf
);

router.put(
  "/update/:id",
  protect,
  isTeacher,
  uploadMiddleware.single("pdf"),
  updatePdf
);

router.delete(
  "/delete/:id",
  protect,
  isTeacher,
  deletePdf
);

export default router;
