import { Crown, X, Check, Sparkles } from "lucide-react";

const PERKS = [
  "Premium templates — Aurora & Onyx",
  "Custom accent colours for any template",
  "AI Tailor-to-Job & AI Mock Interview",
  "Early access to new Pro features",
];

export default function UpgradeModal({ open, feature, onClose, onUpgrade }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(3px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-paper shadow-2xl overflow-hidden"
        style={{ animation: "upPop .22s cubic-bezier(.22,1,.36,1) both" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid place-items-center w-8 h-8 rounded-lg text-ink2 hover:text-ink hover:bg-card transition"
        >
          <X size={18} />
        </button>

        {/* header */}
        <div
          className="px-6 pt-8 pb-5 text-center"
          style={{
            background:
              "linear-gradient(160deg, rgba(24,168,132,.20), transparent 70%)",
          }}
        >
          <div
            className="mx-auto w-14 h-14 grid place-items-center rounded-2xl mb-3"
            style={{
              background: "linear-gradient(135deg,#18a884,#0f8163)",
              boxShadow: "0 12px 26px -8px rgba(24,168,132,.65)",
            }}
          >
            <Crown size={26} className="text-white" />
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug">
            {feature ? `${feature} is a Pro feature` : "Unlock CareerCraft Pro"}
          </h3>
          <p className="text-sm text-ink2 mt-1.5">
            Upgrade to use this — plus everything below.
          </p>
        </div>

        {/* perks */}
        <div className="px-6">
          <ul className="flex flex-col gap-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-brand/15 mt-0.5">
                  <Check size={12} className="text-brand" />
                </span>
                <span className="text-ink">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* actions */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-2">
          <button
            onClick={onUpgrade}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition shadow-lg shadow-brand/25"
          >
            <Sparkles size={17} /> View Pro plans
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-ink2 hover:text-ink text-sm font-semibold transition"
          >
            Maybe later
          </button>
        </div>
      </div>
      <style>{`@keyframes upPop{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
