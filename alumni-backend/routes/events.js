import express from "express";
import Event from "../models/Event.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { uploadEvent } from "../cloudinary.js";
import auth from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/", auth, uploadEvent.single("image"), async (req, res) => {
  try {
    const { event_title, description, dateTime, location } = req.body;

    // Validate required fields
    if (!event_title || !description || !dateTime || !location) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Log the Cloudinary file upload result
    console.log("File upload result:", req.file);

    const event = new Event({
      event_title,
      description,
      dateTime,
      location,
      image: req.file ? req.file.path : null,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({
      message: "Server error during event creation",
      error: error.message,
    });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update an event
router.patch("/:id", auth, uploadEvent.single("image"), async (req, res) => {
  try {
    const { event_title, description, dateTime, location } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event_title) event.event_title = event_title;
    if (description) event.description = description;
    if (dateTime) event.dateTime = dateTime;
    if (location) event.location = location;
    if (req.file) event.image = req.file.path;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
