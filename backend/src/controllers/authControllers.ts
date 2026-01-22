import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Pdf from "../models/pdf";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { resolve } from "dns";

/* ---------------- GOOGLE CLIENT ---------------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------------- REGISTER ---------------- */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role: role || "student",
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ---------------- GOOGLE LOGIN ---------------- */
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        role: "student", // default role
        password: "google-auth",
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};

/* ---------------- ROLE MIDDLEWARE ---------------- */
export const isTeacher = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher only" });
  }
  next();
};

/* ---------------- PROFILE ---------------- */
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "teacher") {
      const notes = await Pdf.find({ uploadedBy: user._id }).sort({
        createdAt: -1,
      });
      return res.json({ user, notes });
    }

    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ALL USERS (ADMIN / FUTURE) ---------------- */
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    const students = await User.find({ role: "student" }).select("-password");

    res.json({ teachers, students });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//update profile

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, role, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found"});

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,

      },
    });
  }catch (err) {
    res.status(500).json({ message: "failed to update profiel "});
  }
};


//delete profile

export const deleteProfile = async (req: any, res: Response) => {
try{
  const userId = req.user.id;

  await Pdf.deleteMany({ uploadedBy: userId });

  await User.findByIdAndDelete(userId);

  res.json({ message: "Account deleted successfully" });
} catch (err) {
  res.status(500).json({ message: "Failed to delete account" });
}
};