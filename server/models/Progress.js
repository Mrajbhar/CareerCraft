import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    problem: { type: String, required: true },
    verdict: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Attempted"],
      default: "Attempted",
    },
    language: { type: String, default: "python" },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    solved: { type: [String], default: [] },
    submissions: { type: [submissionSchema], default: [] },
    days: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Progress", progressSchema);
