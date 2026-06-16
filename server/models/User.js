import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },            // bcrypt hash (absent/random for Google accounts)
    googleId: { type: String },            // set when the account is linked to Google
    avatar: { type: String },              // Google profile picture (optional)
    resetTokenHash: { type: String },      // sha256 of the password-reset token
    resetTokenExp: { type: Date },         // when the reset token expires
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    planExpires: { type: Date },           // when a Pro plan lapses (null = no expiry)
    aiCreditsUsed: { type: Number, default: 0 },   // free-tier AI actions used this cycle
    aiCreditsResetAt: { type: Date },      // when the free AI allowance resets
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);