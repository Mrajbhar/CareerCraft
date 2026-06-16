import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Crown, Loader2, Zap } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { startCheckout } from "../lib/billing";

const FREE_FEATURES = [
  "Unlimited resumes",
  "All 8 templates + fonts & sizing",
  "Watermark-free PDF & Word export",
  "Unlimited AI: summary, bullets & review",
  "AI cover letter generator",
  "ATS checker + job-description match",
  "Full DSA + interview-prep library",
];
const PRO_FEATURES = [
  "Everything in Free, always",
  "AI Tailor-to-Job — rewrite your resume for any job post",
  "AI Mock Interview — unlimited practice with live feedback",
  "Early access to new Pro features",
  "Support an indie maker ❤",
];

export default function Pricing() {
  const { user, isPro, setUserData } = useAuth();
  const nav = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [busy, setBusy] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/billing/plans").then((r) => setCatalog(r.data)).catch(() => setCatalog({ plans: [], configured: false }));
  }, []);

  const planByKey = (k) => catalog?.plans?.find((p) => p.key === k);
  const monthly = planByKey("monthly");
  const yearly = planByKey("yearly");
  const sprint = planByKey("sprint");

  const upgrade = async (planKey) => {
    if (!user) { nav("/login"); return; }
    setBusy(planKey);
    try {
      const updated = await startCheckout(planKey, user);
      setUserData(updated);
      setDone(true);
    } catch (e) {
      if (e?.message !== "cancelled")
        alert(e?.response?.data?.error || e?.response?.data?.msg || e?.message || "Checkout failed.");
    }
    setBusy(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full"><Sparkles size={14} /> Pricing</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-4">Land the job faster with Pro</h1>
        <p className="text-ink2 mt-2 max-w-lg mx-auto">Start free. Upgrade when you want unlimited AI, clean exports, and the full interview toolkit.</p>
        {isPro && (
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-brand text-white text-sm font-semibold">
            <Crown size={16} /> You're on Pro{user?.planExpires ? ` · renews/expires ${new Date(user.planExpires).toLocaleDateString()}` : ""}
          </div>
        )}
        {done && !isPro && <p className="text-brand font-semibold mt-4">Payment received — enjoy Pro! 🎉</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-5 items-start">
        {/* Free */}
        <div className="rounded-2xl border border-line bg-card p-6 sm:p-7">
          <h3 className="font-display text-xl font-semibold">Free</h3>
          <div className="mt-2 mb-5"><span className="font-display text-4xl font-semibold">₹0</span><span className="text-ink2"> / forever</span></div>
          <ul className="flex flex-col gap-2.5 mb-6">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm"><Check size={17} className="text-ink2 shrink-0 mt-0.5" /><span className="text-ink2">{f}</span></li>
            ))}
          </ul>
          <button onClick={() => nav(user ? "/dashboard" : "/signup")}
            className="w-full py-3 rounded-xl border border-line bg-white text-ink font-semibold hover:bg-paper transition">
            {user ? "Go to dashboard" : "Get started free"}
          </button>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-brand bg-card p-6 sm:p-7 shadow-xl shadow-brand/10">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 text-xs font-bold bg-brand text-white px-3 py-1 rounded-full"><Crown size={13} /> MOST POPULAR</span>
          <h3 className="font-display text-xl font-semibold">Pro</h3>

          <div className="mt-2 mb-1 flex items-end gap-2">
            <span className="font-display text-4xl font-semibold">₹{monthly?.price ?? 199}</span>
            <span className="text-ink2 mb-1">/ month</span>
          </div>
          {yearly && (
            <p className="text-xs text-ink2 mb-5">or ₹{yearly.price}/year — save {Math.round((1 - yearly.price / ((monthly?.price ?? 199) * 12)) * 100)}%</p>
          )}

          <ul className="flex flex-col gap-2.5 mb-6">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm"><Check size={17} className="text-brand shrink-0 mt-0.5" /><span>{f}</span></li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            <button onClick={() => upgrade("monthly")} disabled={isPro || busy}
              className="w-full py-3 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 hover:bg-brand-dark transition inline-flex items-center justify-center gap-2">
              {busy === "monthly" ? <Loader2 size={17} className="animate-spin" /> : <Crown size={17} />}
              {isPro ? "You're on Pro" : `Go Pro — ₹${monthly?.price ?? 199}/mo`}
            </button>
            {yearly && (
              <button onClick={() => upgrade("yearly")} disabled={isPro || busy}
                className="w-full py-2.5 rounded-xl border border-brand text-brand font-semibold disabled:opacity-60 hover:bg-brand/5 transition inline-flex items-center justify-center gap-2">
                {busy === "yearly" ? <Loader2 size={16} className="animate-spin" /> : null}
                Pay yearly — ₹{yearly.price}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7-day pass */}
      {sprint && (
        <div className="mt-5 rounded-2xl border border-line bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-11 h-11 rounded-xl bg-rust/10"><Zap className="text-rust" size={22} /></div>
            <div>
              <div className="font-display text-lg font-semibold">{sprint.label}</div>
              <p className="text-sm text-ink2">Job hunting right now? Get full Pro access for {sprint.days} days — no subscription.</p>
            </div>
          </div>
          <button onClick={() => upgrade("sprint")} disabled={isPro || busy}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-rust text-white font-semibold disabled:opacity-60 hover:-translate-y-0.5 transition inline-flex items-center gap-2">
            {busy === "sprint" ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} ₹{sprint.price} for {sprint.days} days
          </button>
        </div>
      )}

      {catalog && catalog.configured === false && (
        <p className="text-center text-xs text-ink2 mt-6">Note: payments aren't configured yet — add your Razorpay keys to <span className="font-mono">server/.env</span> to enable checkout.</p>
      )}
      <p className="text-center text-xs text-ink2 mt-6">Secure payments via Razorpay. Cancel anytime — Pro stays active until it expires.</p>
    </div>
  );
}