
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },            
    googleId: { type: String },            
    avatar: { type: String },              
    resetTokenHash: { type: String },      
    resetTokenExp: { type: Date },         
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);