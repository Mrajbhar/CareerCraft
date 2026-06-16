// ===> place at: server/controllers/billingController.js
import crypto from "crypto";
import User from "../models/User.js";
import { PLANS, FREE_AI_CREDITS, grantPro, publicUser } from "../lib/plan.js";

const hasKeys = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// GET /api/billing/plans — public pricing catalog for the Pricing page
export const getPlans = (req, res) => {
  res.json({
    freeAiCredits: FREE_AI_CREDITS,
    configured: hasKeys(),
    plans: Object.values(PLANS).map(({ key, label, price, days }) => ({ key, label, price, days })),
  });
};

// POST /api/billing/checkout — create a Razorpay order for the chosen plan
export const createOrder = async (req, res) => {
  if (!hasKeys())
    return res.status(400).json({ msg: "Payments not configured", error: "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env, then restart the server." });
  const plan = PLANS[req.body.plan];
  if (!plan) return res.status(400).json({ msg: "Unknown plan." });
  let Razorpay;
  try {
    Razorpay = (await import("razorpay")).default; // lazy import so the server runs without the package until installed
  } catch {
    return res.status(500).json({ msg: "Razorpay not installed", error: "Run `npm install razorpay` in the server folder, then restart the server." });
  }
  try {
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await rzp.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `cc_${Date.now()}`,
      notes: { userId: String(req.userId), plan: plan.key },
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID, plan: plan.key, label: plan.label });
  } catch (e) {
    console.error("Razorpay order error:", e?.error || e?.message || e);
    res.status(500).json({ msg: "Could not start checkout", error: e?.error?.description || e?.message || "Check that your Razorpay key id/secret are correct." });
  }
};

// POST /api/billing/verify — verify Razorpay signature, then grant Pro
export const verifyPayment = async (req, res) => {
  if (!hasKeys()) return res.status(400).json({ msg: "Payments not configured." });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !PLANS[plan])
    return res.status(400).json({ msg: "Missing payment fields." });
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ msg: "Payment verification failed." });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ msg: "User not found." });
  grantPro(user, plan);
  await user.save();
  res.json({ ok: true, user: publicUser(user) });
};