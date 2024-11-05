import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    event_title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    image: {
      type: String,
      get: function (url) {
        return url || null;
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model("Event", EventSchema);
