import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "Untitled Resume" },
    template: { type: String, default: "classic" },
    data: { type: Object, default: {} },
    label: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("ResumeVersion", versionSchema);
