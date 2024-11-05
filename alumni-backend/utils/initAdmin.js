import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    const admin = new User({
      first_name: "Admin",
      last_name: "DBU",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
      isVerified: true,
      tempDocument: "Not required for admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};
