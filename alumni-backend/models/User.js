import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: String,
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: function () {
      return !this.isAdmin;
    },
    enum: [
      "Information Technology",
      "Information System",
      "Computer Science",
      "Software Engineering",
    ],
  },
  batch: String,
  profile_image: {
    type: String,
    get: function (url) {
      return url || null;
    },
  },
  linkedin_profile: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  tempDocument: {
    type: String,
    required: function () {
      return !this.isAdmin;
    },
    get: function (url) {
      if (!url) return null;
      return url.startsWith("http")
        ? url
        : `${process.env.CLOUDINARY_URL}/${url}`;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
