import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Missing Cloudinary credentials in environment variables:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
  });
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
});

// Profile images storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alumni/profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Documents storage
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alumni/documents",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1024, height: 1024, crop: "limit" }],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `temp_img_${uniqueSuffix}`;
    },
  },
});

const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alumni/events",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1024, height: 1024, crop: "limit" }],
  },
});

const surveyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alumni/surveys",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1024, height: 1024, crop: "limit" }],
  },
});

export const uploadEvent = multer({ storage: eventStorage });
export const uploadSurvey = multer({ storage: surveyStorage });

export const uploadProfile = multer({ storage: profileStorage });
export const uploadDocument = multer({ storage: documentStorage });
