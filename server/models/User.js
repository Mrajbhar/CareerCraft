import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    resetTokenHash: { type: String },
    resetTokenExp: { type: Date },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    planExpires: { type: Date },
    aiCreditsUsed: { type: Number, default: 0 },
    aiCreditsResetAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
