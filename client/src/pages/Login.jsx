import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Code2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Login() {
  const { login, signup, googleLogin, forgotPassword, resetPassword } =
    useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const urlToken = new URLSearchParams(loc.search).get("token");

  const [mode, setMode] = useState(
    urlToken ? "reset" : loc.pathname === "/signup" ? "signup" : "login",
  );
  const [resetToken, setResetToken] = useState(urlToken || "");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const googleBtnRef = useRef(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isSignup = mode === "signup";
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const goMode = (m) => {
    setMode(m);
    setErr("");
    setInfo("");
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  const submit = async () => {
    setErr("");
    if (isSignup) {
      if (form.name.trim().length < 2)
        return setErr("Please enter your full name.");
      if (!EMAIL_RE.test(form.email.trim()))
        return setErr("Please enter a valid email address.");
      if (form.password.length < 8)
        return setErr("Password must be at least 8 characters.");
      if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
        return setErr("Password needs a letter and a number.");
      if (form.password !== form.confirm)
        return setErr("Passwords do not match.");
    } else {
      if (!EMAIL_RE.test(form.email.trim()))
        return setErr("Please enter a valid email address.");
      if (!form.password) return setErr("Please enter your password.");
    }
    setBusy(true);
    try {
      if (isSignup)
        await signup(form.name.trim(), form.email.trim(), form.password);
      else await login(form.email.trim(), form.password);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.msg || "Something went wrong.");
    }
    setBusy(false);
  };

  const sendReset = async () => {
    setErr("");
    setInfo("");
    if (!EMAIL_RE.test(form.email.trim()))
      return setErr("Please enter a valid email address.");
    setBusy(true);
    try {
      const data = await forgotPassword(form.email.trim());
      setInfo(data.msg || "If an account exists, a reset link has been sent.");
      if (data.resetToken) {
        setResetToken(data.resetToken);
      } // dev: lets you continue in-app
    } catch (e) {
      setErr(e.response?.data?.msg || "Could not send reset link.");
    }
    setBusy(false);
  };

  const doReset = async () => {
    setErr("");
    if (form.password.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      return setErr("Password needs a letter and a number.");
    if (form.password !== form.confirm)
      return setErr("Passwords do not match.");
    setBusy(true);
    try {
      await resetPassword(resetToken, form.password);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.msg || "This reset link is invalid or expired.");
    }
    setBusy(false);
  };

  // Google button (login/signup only)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || (mode !== "login" && mode !== "signup")) return;
    const render = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          setErr("");
          setBusy(true);
          try {
            await googleLogin(resp.credential);
            nav("/dashboard");
          } catch (e) {
            setErr(e.response?.data?.msg || "Google login failed.");
          }
          setBusy(false);
        },
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        width: 340,
        text: isSignup ? "signup_with" : "signin_with",
      });
    };
    if (window.google?.accounts?.id) {
      render();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.body.appendChild(s);
  }, [mode]);

  // dark-theme input: visible text on dark surface + clear brand focus ring
  const input =
    "w-full pl-11 pr-4 py-3 rounded-xl border border-line bg-white/[0.04] text-ink text-[15px] placeholder-ink2 outline-none transition focus:border-brand focus:bg-white/[0.06] focus:ring-2 focus:ring-brand/25";
  const strength = pwStrength(form.password);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][
    strength
  ];
  const strengthColor = ["#b04a36", "#c6692f", "#d4a23a", "#2dd4bf", "#18a884"][
    strength
  ];

  const features = [
    {
      icon: Sparkles,
      t: "AI Resume Builder",
      s: "Summaries & bullet points written for you",
    },
    {
      icon: ShieldCheck,
      t: "ATS Resume Checker",
      s: "Score your resume and fix what's missing",
    },
    {
      icon: Code2,
      t: "Interview Studio",
      s: "DSA, SQL, system design & mock interviews",
    },
  ];
  const stats = [
    ["7", "Templates"],
    ["170+", "DSA problems"],
    ["Free", "to start"],
  ];

  const heading = isSignup
    ? "Create your account"
    : isForgot
      ? "Reset your password"
      : isReset
        ? "Set a new password"
        : "Welcome back";
  const sub = isSignup
    ? "Sign up and build your first resume in minutes."
    : isForgot
      ? "Enter your email and we'll send you a reset link."
      : isReset
        ? "Choose a new password for your account."
        : "Log in to access your resumes.";

  const PwStrength = () =>
    form.password ? (
      <div className="mb-3 mt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{
                background: i < strength ? strengthColor : "var(--color-line)",
                transition: "background .3s",
              }}
            />
          ))}
        </div>
        <div className="text-xs mt-1" style={{ color: strengthColor }}>
          {strengthLabel}
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <style>{`
        @keyframes lf{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .lf{animation:lf .5s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      {/* brand pitch panel */}
      <div
        className="hidden lg:flex relative overflow-hidden border-r border-line p-12 flex-col justify-between text-white"
        style={{ background: "linear-gradient(160deg,#0e1a17,#0b0e14 62%)" }}
      >
        <div
          className="absolute -top-24 -right-24 w-[26rem] h-[26rem] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(24,168,132,.24), transparent 70%)",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand text-white">
            <Layers size={20} />
          </span>
          <strong className="font-display text-2xl">
            Career<span className="text-brand">Craft</span>
          </strong>
        </div>

        <div className="relative">
          <h2 className="font-display text-[2.1rem] leading-[1.15] font-semibold">
            Land your next role,
            <br />
            powered by AI.
          </h2>
          <p className="text-white/75 mt-3 max-w-sm text-[15px] leading-relaxed">
            Build a standout resume, beat the ATS, and practice real interviews
            — all in one place.
          </p>

          <ul className="mt-7 space-y-4">
            {features.map((f, i) => (
              <li
                key={f.t}
                className="flex items-start gap-3 lf"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand/15 text-brand shrink-0">
                  <f.icon size={17} />
                </span>
                <div>
                  <div className="font-semibold text-[15px]">{f.t}</div>
                  <div className="text-[13px] text-white/65 mt-0.5">{f.s}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex gap-8 mt-8">
            {stats.map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-semibold">{n}</div>
                <div className="text-xs text-white/55 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/45">
          No credit card required
        </p>
      </div>

      {/* form side */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm lf">
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand text-white">
              <Layers size={19} />
            </span>
            <strong className="font-display text-2xl">
              Career<span className="text-brand">Craft</span>
            </strong>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {heading}
          </h1>
          <p className="text-ink2 mt-1.5 mb-6">{sub}</p>

          {/* Google + email (login/signup only) */}
          {(isLogin || isSignup) && (
            <>
              {GOOGLE_CLIENT_ID ? (
                <div
                  ref={googleBtnRef}
                  className="flex justify-center mb-1 min-h-[44px]"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  title="Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-line bg-white/[0.03] font-semibold text-ink2 opacity-70 cursor-not-allowed"
                >
                  <GoogleIcon /> Continue with Google
                </button>
              )}
              <div className="flex items-center gap-3 my-5 text-xs text-ink2">
                <span className="h-px flex-1 bg-line" /> or{" "}
                {isSignup ? "sign up" : "log in"} with email{" "}
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          {isSignup && (
            <div className="relative mb-3">
              <UserIcon
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
              />
              <input
                className={input}
                placeholder="Full name"
                value={form.name}
                onChange={set("name")}
              />
            </div>
          )}

          {(isLogin || isSignup || isForgot) && (
            <div className="relative mb-3">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
              />
              <input
                className={input}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={set("email")}
                onKeyDown={(e) =>
                  e.key === "Enter" && (isForgot ? sendReset() : submit())
                }
              />
            </div>
          )}

          {(isLogin || isSignup || isReset) && (
            <div className="relative mb-1">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
              />
              <input
                className={input + " pr-11"}
                placeholder={isReset ? "New password" : "Password"}
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                onKeyDown={(e) =>
                  e.key === "Enter" && (isReset ? doReset() : submit())
                }
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink2 hover:text-ink p-1"
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          )}

          {/* forgot link (login only) */}
          {isLogin && (
            <div className="text-right mb-2">
              <button
                onClick={() => goMode("forgot")}
                className="text-sm text-brand font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {(isSignup || isReset) && <PwStrength />}

          {(isSignup || isReset) && (
            <div className="relative mb-3">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
              />
              <input
                className={input}
                placeholder="Confirm password"
                type={showPw ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                onKeyDown={(e) =>
                  e.key === "Enter" && (isReset ? doReset() : submit())
                }
              />
            </div>
          )}

          {info && (
            <div className="text-sm mb-3 bg-brand/10 border border-brand/25 text-ink rounded-lg px-3 py-2.5 flex items-start gap-2">
              <CheckCircle2 size={16} className="text-brand mt-0.5 shrink-0" />
              <div>
                {info}
                {resetToken && isForgot && (
                  <button
                    onClick={() => goMode("reset") || setResetToken(resetToken)}
                    className="block mt-1.5 font-semibold text-brand hover:underline"
                  >
                    Continue to reset →
                  </button>
                )}
              </div>
            </div>
          )}
          {err && (
            <div className="text-rust text-sm mb-3 bg-rust/10 border border-rust/20 rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          {/* primary action */}
          <button
            onClick={isForgot ? sendReset : isReset ? doReset : submit}
            disabled={busy}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 mt-1"
          >
            {busy
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : isForgot
                  ? "Send reset link"
                  : isReset
                    ? "Update password"
                    : "Log in"}
          </button>

          {isSignup && (
            <p className="text-[11px] text-ink2 text-center mt-3 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="text-brand hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-brand hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          )}

          {/* footer links */}
          <div className="text-center text-sm text-ink2 mt-6">
            {isLogin && (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => goMode("signup")}
                  className="text-brand font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
            {isSignup && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => goMode("login")}
                  className="text-brand font-semibold hover:underline"
                >
                  Log in
                </button>
              </>
            )}
            {(isForgot || isReset) && (
              <button
                onClick={() => goMode("login")}
                className="inline-flex items-center gap-1.5 text-brand font-semibold hover:underline"
              >
                <ArrowLeft size={14} /> Back to log in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
