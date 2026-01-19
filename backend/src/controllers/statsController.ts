import { Request, Response } from "express";
import User from "../models/User";
import Pdf from "../models/pdf";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [teachers, students, notes] = await Promise.all([
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "student" }),
      Pdf.countDocuments({}),
    ]);

    res.json({ teachers, students, notes });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

