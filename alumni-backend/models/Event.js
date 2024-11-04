import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    event_title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
