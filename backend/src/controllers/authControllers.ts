import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Pdf from "../models/pdf";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        role,
        password: hashedPassword
    });

    res.status(201).json(user);
};

export const isTeacher = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher only" });
  }
  next();
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // If teacher, get their uploaded PDFs
    if (user.role === "teacher") {
      const notes = await Pdf.find({ uploadedBy: user._id }).sort({ createdAt: -1 });
      return res.json({ user, notes });
    }

    // If student, just return user info
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    const students = await User.find({ role: "student" }).select("-password");

    res.json({ teachers, students });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};