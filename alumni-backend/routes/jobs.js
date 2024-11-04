import express from "express";
import Job from "../models/Job.js";
import auth from "../middleware/auth.js";
import cors from "cors";

const router = express.Router();
router.use(cors());

// Create a job
router.post("/", auth, async (req, res) => {
  try {
    const { title, company_name, description, location, deadline } = req.body;
    const job = new Job({
      title,
      company_name,
      description,
      location,
      deadline,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a job
router.patch("/:id", auth, async (req, res) => {
  try {
    const { title, company_name, description, location, deadline } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (title) job.title = title;
    if (company_name) job.company_name = company_name;
    if (description) job.description = description;
    if (location) job.location = location;
    if (deadline) job.deadline = deadline;

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a job
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
