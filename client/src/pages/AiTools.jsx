import { useState } from "react";
import {
  Mail,
  Sparkles,
  TrendingUp,
  Target,
  Copy,
  Check,
  Loader2,
  Wand2,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const TOOLS = [
  {
    id: "email",
    label: "Email Writer",
    icon: Mail,
    desc: "Follow-ups, thank-yous, networking & salary-negotiation emails.",
  },
  {
    id: "linkedin",
    label: "LinkedIn Optimizer",
    icon: Sparkles,
    desc: "Turn your LinkedIn About into a punchier version.",
  },
  {
    id: "quantify",
    label: "Achievement Quantifier",
    icon: TrendingUp,
    desc: "Rewrite weak bullets into strong, quantified ones.",
  },
  {
    id: "gap",
    label: "Gap Analysis",
    icon: Target,
    desc: "Compare your resume to a job and get a fix-it plan.",
  },
];

const EMAIL_KINDS = [
  ["follow-up", "Follow-up"],
  ["thank-you", "Thank-you"],
  ["networking", "Networking"],
  ["salary negotiation", "Salary negotiation"],
];

export default function AiTools() {
  const { isPro } = useAuth();
  const [tool, setTool] = useState("email");
  const [emailKind, setEmailKind] = useState("follow-up");
  const [emailDetails, setEmailDetails] = useState("");
  const [about, setAbout] = useState("");
  const [bullets, setBullets] = useState("");
  const [gapResume, setGapResume] = useState("");
  const [gapJD, setGapJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setErr("");
    setResult("");
    setCopied(false);
    let url, payload;
    if (tool === "email") {
      url = "/ai/email";
      payload = { kind: emailKind, details: emailDetails };
    } else if (tool === "linkedin") {
      url = "/ai/linkedin";
      payload = { about };
    } else if (tool === "quantify") {
      url = "/ai/quantify";
      payload = { bullets };
    } else {
      url = "/ai/gap";
      payload = { resume: gapResume, jobDescription: gapJD };
    }
    setLoading(true);
    try {
      const { data } = await api.post(url, payload);
      setResult(data.text || "");
    } catch (e) {
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.msg ||
          "Something went wrong. Please try again.",
      );
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const ta =
    "w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition resize-y";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/10">
          <Wand2 className="text-brand" size={26} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold leading-tight">
            AI Tools
          </h1>
          <p className="text-ink2 text-sm mt-0.5">
            Quick AI helpers for your job search.
            {!isPro && " Pro uses a higher-quality model."}
          </p>
        </div>
      </div>

      {/* tool tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTool(t.id);
              setResult("");
              setErr("");
            }}
            className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${tool === t.id ? "border-brand bg-brand/5" : "border-line bg-card hover:border-brand/30"}`}
          >
            <t.icon
              size={18}
              className={tool === t.id ? "text-brand" : "text-ink2"}
            />
            <span className="text-sm font-semibold leading-tight">
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-sm text-ink2 mb-4">
        {TOOLS.find((t) => t.id === tool)?.desc}
      </p>

      {/* inputs */}
      <div className="flex flex-col gap-3 mb-4">
        {tool === "email" && (
          <>
            <div className="flex flex-wrap gap-2">
              {EMAIL_KINDS.map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setEmailKind(v)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${emailKind === v ? "bg-brand text-white border-brand" : "bg-paper/40 text-ink2 border-line hover:text-ink"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <textarea
              rows={5}
              value={emailDetails}
              onChange={(e) => setEmailDetails(e.target.value)}
              className={ta}
              placeholder="Who is it to and why? e.g. Following up with the hiring manager Priya after my Tuesday interview for the Frontend role at Acme."
            />
          </>
        )}
        {tool === "linkedin" && (
          <textarea
            rows={7}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className={ta}
            placeholder="Paste your current LinkedIn About section here…"
          />
        )}
        {tool === "quantify" && (
          <textarea
            rows={6}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
            className={ta}
            placeholder={
              "Paste bullet points, one per line:\nWorked on the company website\nHelped the team with testing"
            }
          />
        )}
        {tool === "gap" && (
          <>
            <textarea
              rows={5}
              value={gapResume}
              onChange={(e) => setGapResume(e.target.value)}
              className={ta}
              placeholder="Paste your resume text (summary, skills, experience)…"
            />
            <textarea
              rows={5}
              value={gapJD}
              onChange={(e) => setGapJD(e.target.value)}
              className={ta}
              placeholder="Paste the job description…"
            />
          </>
        )}
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 hover:bg-brand-dark transition"
      >
        {loading ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Generating…
          </>
        ) : (
          <>
            <Sparkles size={17} /> Generate
          </>
        )}
      </button>

      {err && (
        <div className="mt-4 text-rust text-sm bg-rust/10 border border-rust/20 rounded-lg px-3 py-2">
          {err}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-line bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
            <span className="text-sm font-semibold text-ink2">Result</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>
          <pre
            className="px-4 py-4 text-sm text-ink whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: "inherit" }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
