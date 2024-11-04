import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema(
  {
    survey_title: { type: String, required: true },
    description: { type: String, required: true },
    survey_link: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Survey", SurveySchema);
