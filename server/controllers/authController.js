import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID, randomBytes, createHash } from "crypto";
import User from "../models/User.js";

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import { publicUser } from "../lib/plan.js";
const isDev = process.env.NODE_ENV !== "production";
const hashToken = (t) => createHash("sha256").update(t).digest("hex");
const validPassword = (p) => typeof p === "string" && p.length >= 8 && /[A-Za-z]/.test(p) && /[0-9]/.test(p);

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (name.length < 2) return res.status(400).json({ msg: "Please enter your full name." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ msg: "Please enter a valid email address." });
    if (!validPassword(password)) return res.status(400).json({ msg: "Password must be 8+ characters with a letter and a number." });
    if (await User.findOne({ email })) return res.status(400).json({ msg: "An account with this email already exists." });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ msg: "Signup failed", error: e.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;
    if (!EMAIL_RE.test(email) || !password) return res.status(400).json({ msg: "Enter a valid email and password." });

    const user = await User.findOne({ email });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      if (user && user.googleId && !user.password)
        return res.status(400).json({ msg: "This account uses Google sign-in. Use “Continue with Google”." });
      return res.status(400).json({ msg: "Invalid email or password." });
    }
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ msg: "Login failed", error: e.message });
  }
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ msg: "Missing Google credential." });

    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!r.ok) return res.status(401).json({ msg: "Could not verify Google account." });
    const p = await r.json();

    if (process.env.GOOGLE_CLIENT_ID && p.aud !== process.env.GOOGLE_CLIENT_ID)
      return res.status(401).json({ msg: "Google token was issued for a different app." });
    if (String(p.email_verified) !== "true")
      return res.status(401).json({ msg: "Your Google email is not verified." });

    const email = (p.email || "").toLowerCase();
    if (!email) return res.status(400).json({ msg: "Google did not return an email." });

    const fallbackName =
      (p.name && p.name.trim()) ||
      (p.given_name && p.given_name.trim()) ||
      (email.includes("@") ? email.split("@")[0] : "") ||
      "User";

    let user = await User.findOne({ email });
    if (!user) {
      const randomHash = await bcrypt.hash(randomUUID(), 10);
      user = await User.create({ name: fallbackName, email, password: randomHash, googleId: p.sub, avatar: p.picture });
    } else {
      let changed = false;
      if (!user.name) { user.name = fallbackName; changed = true; }
      if (!user.googleId) { user.googleId = p.sub; changed = true; }
      if (p.picture && !user.avatar) { user.avatar = p.picture; changed = true; }
      if (changed) await user.save();
    }
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (e) {
    console.error("Google auth error:", e);
    res.status(500).json({ msg: "Google login failed", error: e.message });
  }
};

// POST /api/auth/forgot  — issue a reset token (emailed in production; logged + returned in dev)
export const forgotPassword = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return res.status(400).json({ msg: "Please enter a valid email address." });

    const user = await User.findOne({ email });
    // generic response either way, so we don't reveal which emails are registered
    const generic = { msg: "If an account exists for that email, a password reset link has been sent." };

    if (user) {
      const token = randomBytes(32).toString("hex");
      user.resetTokenHash = hashToken(token);
      user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset?token=${token}`;
      console.log("\n🔑 Password reset link (would be emailed):\n   " + resetUrl + "\n");
      // TODO: send `resetUrl` by email here (e.g. nodemailer) in production.

      if (isDev) return res.json({ ...generic, devNote: "Dev mode: link logged to server console.", resetToken: token, resetUrl });
    }
    res.json(generic);
  } catch (e) {
    res.status(500).json({ msg: "Could not start password reset", error: e.message });
  }
};

// POST /api/auth/reset  — set a new password using the token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ msg: "Missing reset token." });
    if (!validPassword(password)) return res.status(400).json({ msg: "Password must be 8+ characters with a letter and a number." });

    const user = await User.findOne({ resetTokenHash: hashToken(token), resetTokenExp: { $gt: new Date() } });
    if (!user) return res.status(400).json({ msg: "This reset link is invalid or has expired." });

    user.password = await bcrypt.hash(password, 10);
    user.resetTokenHash = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ token: sign(user._id), user: publicUser(user) }); // log them in
  } catch (e) {
    res.status(500).json({ msg: "Password reset failed", error: e.message });
  }
};

// GET /api/auth/me — current user (used to refresh plan/credits after changes)
export const me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ msg: "User not found." });
  res.json({ user: publicUser(user) });
};

// POST /api/auth/password  (auth) — change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "Account not found." });
    if (!user.password) return res.status(400).json({ msg: "This account uses Google sign-in, so it has no password to change." });
    if (!(await bcrypt.compare(currentPassword || "", user.password))) return res.status(400).json({ msg: "Your current password is incorrect." });
    if (!validPassword(newPassword)) return res.status(400).json({ msg: "New password must be 8+ characters with a letter and a number." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ msg: "Password updated." });
  } catch (e) {
    res.status(500).json({ msg: "Could not update password", error: e.message });
  }
};

// PATCH /api/auth/profile  (auth) — update display name
export const updateProfile = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (name.length < 2) return res.status(400).json({ msg: "Please enter your full name." });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "Account not found." });
    user.name = name;
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ msg: "Could not update profile", error: e.message });
  }
};