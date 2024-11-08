import express from "express";
import Survey from "../models/Survey.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { uploadSurvey } from "../cloudinary.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", auth, uploadSurvey.single("image"), async (req, res) => {
  try {
    const { survey_title, description, survey_link } = req.body;
    const survey = new Survey({
      survey_title,
      description,
      survey_link,
      image: req.file ? req.file.path : null,
      createdBy: req.user.id,
    });
    await survey.save();
    res
      .status(201)
      .json({ message: "Survey created successfully", data: survey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all surveys
router.get("/", auth, async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json({ data: surveys });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single survey
router.get("/:id", auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    res.json({ data: survey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a survey
router.patch("/:id", auth, uploadSurvey.single("image"), async (req, res) => {
  try {
    const { survey_title, description, survey_link } = req.body;
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    if (survey_title) survey.survey_title = survey_title;
    if (description) survey.description = description;
    if (survey_link) survey.survey_link = survey_link;
    if (req.file) survey.image = req.file.path;

    await survey.save();
    res.json({ message: "Survey updated successfully", data: survey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a survey
router.delete("/:id", auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    await Survey.deleteOne({ _id: req.params.id });
    res.json({ message: "Survey removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
