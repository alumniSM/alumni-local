import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company_name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
