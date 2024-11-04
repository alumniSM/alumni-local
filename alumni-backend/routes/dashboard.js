import express from "express";
import Event from "../models/Event.js";
import Job from "../models/Job.js";
import Survey from "../models/Survey.js";
import User from "../models/User.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [eventCount, jobCount, surveyCount, verifiedAlumniCount] =
      await Promise.all([
        Event.countDocuments(),
        Job.countDocuments(),
        Survey.countDocuments(),
        User.find({ isVerified: true, isAdmin: false }).countDocuments(),
      ]);

    res.json({
      events: eventCount,
      jobs: jobCount,
      surveys: surveyCount,
      verifiedAlumni: verifiedAlumniCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
