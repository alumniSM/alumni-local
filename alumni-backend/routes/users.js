import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";

import { uploadProfile, uploadDocument } from "../cloudinary.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Password validation middleware
const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 14;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length < minLength || password.length > maxLength) {
    return "Password must be between 8 and 14 characters";
  }
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasLowerCase) {
    return "Password must contain at least one lowercase letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  return null;
};

router.post(
  "/register",
  uploadDocument.single("tempDocument"),
  async (req, res) => {
    try {
      const {
        first_name,
        middle_name,
        last_name,
        gender,
        email,
        password,
        department,
        batch,
        phone_number,
        linkedin_profile,
      } = req.body;

      // Validate required fields
      if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !department ||
        !batch
      ) {
        return res.status(400).json({
          message: "Please provide all required fields",
        });
      }

      // Validate document upload
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a temporary document",
        });
      }

      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();

      // Check for existing user with case-insensitive email
      let user = await User.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      });

      if (user) {
        // Delete uploaded file if user already exists
        if (req.file && req.file.path) {
          await cloudinary.uploader.destroy(req.file.public_id);
        }
        return res.status(400).json({
          message: "An account with this email already exists",
        });
      }

      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
        // Delete uploaded file if password validation fails
        if (req.file && req.file.path) {
          await cloudinary.uploader.destroy(req.file.public_id);
        }
        return res.status(400).json({ message: passwordError });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user with Cloudinary URL
      user = new User({
        first_name,
        middle_name,
        last_name,
        gender,
        email: normalizedEmail,
        password: hashedPassword,
        department,
        batch,
        phone_number,
        linkedin_profile,
        tempDocument: req.file.path, // Cloudinary URL
        isVerified: false,
        isAdmin: false,
      });

      await user.save();

      res.status(201).json({
        message: "Registration successful. Please wait for admin approval.",
        userId: user._id,
      });
    } catch (error) {
      console.error("Registration error details:", error);

      // Delete uploaded file if user creation fails
      if (req.file && req.file.path) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid input data",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          message: "An account with this email already exists",
        });
      }

      res.status(500).json({
        message: "Registration failed. Please try again.",
        error: error.message,
      });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Your account is pending approval. Please wait for admin verification.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (for admin)
router.get("/all", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending", adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isVerified: false,
      $or: [{ status: { $exists: false } }, { status: "pending" }],
    }).select("-password");
    res.json(pendingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve or reject user
router.patch("/verify/:userId", adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified, status } = req.body;

    // Create update object with both isVerified and status
    const updateData = {
      isVerified,
      status: status || (isVerified ? "approved" : "rejected"),
    };

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User ${updateData.status} successfully`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.patch(
  "/profile",
  auth,
  uploadProfile.single("profile_image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const fields = [
        "first_name",
        "middle_name",
        "last_name",
        "department",
        "batch",
        "linkedin_profile",
      ];
      fields.forEach((field) => {
        if (req.body[field]) user[field] = req.body[field];
      });

      if (req.file) {
        user.profile_image = req.file.path;
      }

      await user.save();
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get all verified alumni (public route)
router.get("/verified-alumni", async (req, res) => {
  try {
    const verifiedAlumni = await User.find({
      isVerified: true,
      isAdmin: false,
    }).select(
      "first_name middle_name last_name department batch email profile_image"
    );
    res.json(verifiedAlumni);
  } catch (error) {
    console.error("Error fetching verified alumni:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (reject)
router.delete("/:userId", adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User rejected and removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add document download route
router.get("/document/:filename", adminAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      tempDocument: { $regex: new RegExp(req.params.filename, "i") },
    });

    if (!user || !user.tempDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Get the Cloudinary resource
    const result = await cloudinary.api.resource(user.tempDocument, {
      resource_type: "raw",
      type: "upload",
    });

    // Return the secure URL
    res.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
