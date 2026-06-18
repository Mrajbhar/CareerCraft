import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Crown, KeyRound, LogOut, Check, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Avatar({ user, size = 64 }) {
  const initial = (user?.name || "?").trim()[0]?.toUpperCase() || "?";
  return user?.avatar ? (
    <img src={user.avatar} alt="" className="rounded-2xl object-cover ring-2 ring-white/10" style={{ width: size, height: size }} />
  ) : (
    <div className="grid place-items-center rounded-2xl font-bold text-white" style={{ width: size, height: size, fontSize: size * 0.4, background: "linear-gradient(135deg,#18a884,#0f8163)" }}>{initial}</div>
  );
}

export default function Settings() {
  const { user, isPro, logout, setUserData } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState("");

  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  const input = "w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition";

  const saveName = async () => {
    setNameMsg(""); if (name.trim().length < 2) { setNameMsg("Enter your full name."); return; }
    setSavingName(true);
    try { const { data } = await api.patch("/auth/profile", { name }); setUserData(data.user); setNameMsg("Saved"); setTimeout(() => setNameMsg(""), 1500); }
    catch (e) { setNameMsg(e?.response?.data?.msg || "Could not save."); }
    setSavingName(false);
  };

  const savePw = async () => {
    setPwMsg(""); setPwErr("");
    if (nw !== confirm) { setPwErr("New passwords don't match."); return; }
    setSavingPw(true);
    try {
      await api.post("/auth/password", { currentPassword: cur, newPassword: nw });
      setPwMsg("Password updated."); setCur(""); setNw(""); setConfirm("");
    } catch (e) { setPwErr(e?.response?.data?.msg || "Could not update password."); }
    setSavingPw(false);
  };

  const expiry = user?.planExpires ? new Date(user.planExpires).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="font-display text-3xl font-semibold mb-6">Settings</h1>

      {/* profile */}
      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar user={user} size={64} />
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold truncate">{user?.name}</div>
            <div className="text-sm text-ink2 truncate">{user?.email}</div>
          </div>
        </div>
        <label className="text-sm font-semibold flex items-center gap-2 mb-2"><UserIcon size={15} className="text-ink2" /> Display name</label>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <button onClick={saveName} disabled={savingName || name === user?.name}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-50">
            {savingName ? <Loader2 size={15} className="animate-spin" /> : nameMsg === "Saved" ? <Check size={15} /> : null} Save
          </button>
        </div>
        {nameMsg && nameMsg !== "Saved" && <p className="text-xs text-rust mt-1.5">{nameMsg}</p>}
      </section>

      {/* plan */}
      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6 mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-11 h-11 rounded-xl" style={{ background: isPro ? "linear-gradient(135deg,#18a884,#0f8163)" : "var(--color-card)" }}>
              {isPro ? <Crown size={20} className="text-white" /> : <ShieldCheck size={20} className="text-ink2" />}
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">{isPro ? "CareerCraft Pro" : "Free plan"}
                {isPro && <span className="text-[9px] font-bold bg-brand text-white px-1.5 py-0.5 rounded-full tracking-wide">PRO</span>}</div>
              <div className="text-sm text-ink2">{isPro ? (expiry ? `Renews / expires ${expiry}` : "Active") : "Premium templates, AI Tailor & Mock Interview, custom colours."}</div>
            </div>
          </div>
          {isPro ? (
            <button onClick={() => nav("/pricing")} className="px-4 py-2.5 rounded-xl border border-line text-sm font-semibold text-ink2 hover:text-ink transition">Manage plan</button>
          ) : (
            <button onClick={() => nav("/pricing")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition"><Sparkles size={16} /> Upgrade to Pro</button>
          )}
        </div>
      </section>

      {/* password */}
      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6 mb-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><KeyRound size={16} className="text-ink2" /> Change password</h2>
        <div className="flex flex-col gap-3">
          <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" className={input} />
          <input type="password" value={nw} onChange={(e) => setNw(e.target.value)} placeholder="New password (8+ chars, a letter & a number)" className={input} />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" className={input} />
          {pwErr && <p className="text-sm text-rust">{pwErr}</p>}
          {pwMsg && <p className="text-sm text-brand flex items-center gap-1.5"><Check size={15} /> {pwMsg}</p>}
          <button onClick={savePw} disabled={savingPw || !cur || !nw || !confirm}
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
            {savingPw ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Update password
          </button>
          <p className="text-xs text-ink2">If you signed up with Google, you don't have a password to change.</p>
        </div>
      </section>

      {/* sign out */}
      <button onClick={() => { logout(); nav("/"); }}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-rust/30 text-rust font-semibold hover:bg-rust/10 transition">
        <LogOut size={17} /> Sign out
      </button>
    </div>
  );
}