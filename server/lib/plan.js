import User from "../models/User.js";

export const FREE_AI_CREDITS = 8;
const DAY = 24 * 60 * 60 * 1000;

export const PLANS = {
  sprint: { key: "sprint", label: "7-Day Job Sprint", price: 99, days: 7, amount: 9900 },
  monthly: { key: "monthly", label: "Pro Monthly", price: 199, days: 30, amount: 19900 },
  yearly: { key: "yearly", label: "Pro Yearly", price: 1499, days: 365, amount: 149900 },
};

export const isPro = (u) =>
  !!u && u.plan === "pro" && (!u.planExpires || new Date(u.planExpires) > new Date());

export const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  avatar: u.avatar,
  plan: isPro(u) ? "pro" : "free",
  planExpires: u.planExpires || null,
  aiCreditsUsed: u.aiCreditsUsed || 0,
  aiCreditLimit: FREE_AI_CREDITS,
});

// Charge one AI credit for free users (pro = unlimited). Resets monthly.
export async function consumeCredit(userId) {
  const u = await User.findById(userId);
  if (!u) return { ok: false, error: "User not found." };
  if (isPro(u)) return { ok: true };
  const now = Date.now();
  if (!u.aiCreditsResetAt || new Date(u.aiCreditsResetAt).getTime() < now) {
    u.aiCreditsUsed = 0;
    u.aiCreditsResetAt = new Date(now + 30 * DAY);
  }
  if ((u.aiCreditsUsed || 0) >= FREE_AI_CREDITS) {
    return { ok: false, error: `You've used all ${FREE_AI_CREDITS} free AI credits this month. Upgrade to Pro for unlimited AI.` };
  }
  u.aiCreditsUsed = (u.aiCreditsUsed || 0) + 1;
  await u.save();
  return { ok: true, remaining: FREE_AI_CREDITS - u.aiCreditsUsed };
}

// Extend (or start) a Pro plan by the chosen plan's duration.
export function grantPro(u, planKey) {
  const plan = PLANS[planKey];
  if (!plan) return;
  const base = isPro(u) && u.planExpires ? new Date(u.planExpires).getTime() : Date.now();
  u.plan = "pro";
  u.planExpires = new Date(base + plan.days * DAY);
}