import User from "../models/User.js";
import { isPro } from "../lib/plan.js";

// Use AFTER the auth middleware (needs req.userId). Blocks non-Pro users.
export default async function requirePro(req, res, next) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ msg: "Not authenticated." });
  if (!isPro(user))
    return res.status(403).json({ msg: "Pro required", error: "This is a Pro feature — upgrade to unlock it.", upgrade: true });
  next();
}