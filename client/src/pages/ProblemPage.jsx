import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Sparkles, Lock, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import CodeRunner from "../components/CodeRunner";
import UpgradeModal from "../components/UpgradeModal";
import { dsaProblems, complexities } from "../data/dsaProblems";

const DIFF = {
  Easy: { c: "#18a884", bg: "rgba(24,168,132,.14)" },
  Medium: { c: "#e0743a", bg: "rgba(224,116,58,.14)" },
  Hard: { c: "#e0473a", bg: "rgba(224,71,58,.14)" },
};

export default function ProblemPage() {
  const { name } = useParams();
  const nav = useNavigate();
  const { isPro } = useAuth();
  const key = decodeURIComponent(name || "");
  const p = dsaProblems[key];

  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(0);        
  const [aiHint, setAiHint] = useState("");
  const [aiSol, setAiSol] = useState("");
  const [busy, setBusy] = useState("");
  const [helpErr, setHelpErr] = useState("");
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => { setSolved(false); setRevealed(0); setAiHint(""); setAiSol(""); setHelpErr(""); }, [key]);

  if (!p) {
    return (
      <div className="grid place-items-center py-32 px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">Problem not found</h1>
          <p className="text-ink2 mt-2">This problem isn't available to solve in-app yet.</p>
          <button onClick={() => nav("/prep")} className="inline-flex items-center gap-1.5 mt-5 px-4 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition">
            <ArrowLeft size={16} /> Back to Interview Studio
          </button>
        </div>
      </div>
    );
  }

  const d = DIFF[p.difficulty] || DIFF.Easy;
  const cx = complexities[key];

  const recordResult = (verdict) => {
    api.post("/progress/submit", { problem: key, verdict, language: "python" }).catch(() => {});
    if (verdict === "Accepted") {
      setSolved(true);
      api.post("/progress/solve", { problem: key, solved: true }).catch(() => {});
    }
  };

  const getAiHint = async () => {
    setHelpErr(""); setBusy("hint");
    try { const { data } = await api.post("/ai/hint", { title: key, statement: p.statement }); setAiHint(data.text || ""); }
    catch (e) { setHelpErr(e.response?.data?.msg || "Could not get a hint right now."); }
    setBusy("");
  };

  const getAiSolution = async () => {
    if (!isPro) { setUpgrade(true); return; }
    setHelpErr(""); setBusy("sol");
    try { const { data } = await api.post("/ai/solution", { title: key, statement: p.statement, difficulty: p.difficulty }); setAiSol(data.text || ""); }
    catch (e) {
      if (e.response?.status === 402 || e.response?.status === 403) setUpgrade(true);
      else setHelpErr(e.response?.data?.msg || "Could not load the solution right now.");
    }
    setBusy("");
  };

  return (
    <div className="lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      {upgrade && <UpgradeModal open={upgrade} onClose={() => setUpgrade(false)} feature="AI solutions" />}

      <div className="grid lg:grid-cols-2 lg:h-full">
        {/* ---------- description ---------- */}
        <div className="lg:h-full lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-line">
          <div className="px-5 sm:px-7 py-6 max-w-3xl">
            <button onClick={() => nav("/prep")} className="inline-flex items-center gap-1.5 text-ink2 hover:text-ink text-sm font-semibold transition mb-4">
              <ArrowLeft size={16} /> Interview Studio
            </button>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl font-semibold tracking-tight">{key}</h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: d.c, background: d.bg }}>{p.difficulty}</span>
              {p.topic && <span className="text-xs text-ink2 border border-line rounded-full px-2.5 py-1">{p.topic}</span>}
              {solved && <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand"><CheckCircle2 size={14} /> Solved</span>}
            </div>

            <p className="text-[15px] text-ink2 leading-relaxed mt-4 whitespace-pre-line">{p.statement}</p>

            {p.examples?.length > 0 && (
              <div className="mt-6 space-y-3">
                {p.examples.map((ex, i) => (
                  <div key={i} className="rounded-xl border border-line bg-card p-3.5">
                    <div className="text-xs font-semibold text-ink2 mb-1.5">Example {i + 1}</div>
                    <div className="font-mono text-[13px] text-ink"><span className="text-ink2">Input:</span> {ex.input}</div>
                    <div className="font-mono text-[13px] text-ink mt-1"><span className="text-ink2">Output:</span> {ex.output}</div>
                    {ex.explanation && <div className="text-[13px] text-ink2 mt-1.5">{ex.explanation}</div>}
                  </div>
                ))}
              </div>
            )}

            {p.constraints?.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">Constraints</div>
                <ul className="space-y-1.5">
                  {p.constraints.map((c, i) => (
                    <li key={i} className="font-mono text-[13px] text-ink2 flex gap-2"><span className="text-brand">•</span>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {cx && (
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">Target complexity</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[13px] px-2.5 py-1.5 rounded-lg border border-line bg-card" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Time&nbsp;·&nbsp;<b className="text-brand">{cx.time}</b></span>
                  <span className="text-[13px] px-2.5 py-1.5 rounded-lg border border-line bg-card" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Space&nbsp;·&nbsp;<b className="text-brand">{cx.space}</b></span>
                </div>
                <p className="text-[12px] text-ink2 mt-2">Aim for this on the optimal solution. h = tree height, A = amount, k = string length, m·n = grid size.</p>
              </div>
            )}

            {/* hints */}
            <div className="mt-7 rounded-xl border border-line bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1"><Lightbulb size={16} className="text-brand" /> Stuck? Get unstuck</div>
              <p className="text-[13px] text-ink2 mb-3">Reveal a nudge, ask the AI for a hint, or see a full editorial solution (Pro).</p>

              {p.hints?.slice(0, revealed).map((h, i) => (
                <div key={i} className="text-[13px] text-ink2 border-l-2 border-brand/40 pl-3 py-1 mb-2"><b className="text-ink">Hint {i + 1}.</b> {h}</div>
              ))}

              <div className="flex flex-wrap gap-2 mt-1">
                {p.hints && revealed < p.hints.length && (
                  <button onClick={() => setRevealed((r) => r + 1)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-sm font-semibold text-ink hover:bg-paper transition">
                    <Lightbulb size={14} /> Reveal hint {revealed + 1}
                  </button>
                )}
                <button onClick={getAiHint} disabled={busy === "hint"} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-sm font-semibold text-ink hover:bg-paper transition disabled:opacity-60">
                  {busy === "hint" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-brand" />} AI hint
                </button>
                <button onClick={getAiSolution} disabled={busy === "sol"} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-sm font-semibold text-ink hover:bg-paper transition disabled:opacity-60">
                  {busy === "sol" ? <Loader2 size={14} className="animate-spin" /> : isPro ? <Sparkles size={14} className="text-brand" /> : <Lock size={14} className="text-brand" />} Full solution
                </button>
              </div>

              {helpErr && <div className="text-rust text-[13px] mt-3">{helpErr}</div>}
              {aiHint && <div className="text-[13px] text-ink2 mt-3 bg-paper/50 border border-line rounded-lg p-3 whitespace-pre-line">{aiHint}</div>}
              {aiSol && <div className="text-[13px] text-ink2 mt-3 bg-paper/50 border border-line rounded-lg p-3 whitespace-pre-line">{aiSol}</div>}
            </div>

            <a href={`https://leetcode.com/problemset/?search=${encodeURIComponent(key)}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-ink2 hover:text-ink mt-4 transition">
              Open on LeetCode <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ---------- editor + judge ---------- */}
        <div className="lg:h-full lg:overflow-y-auto p-4 sm:p-5">
          <CodeRunner
            key={key}
            initialLangKey="python"
            initialCode={p.starter}
            tests={p.tests}
            funcName={p.func}
            onResult={recordResult}
          />
        </div>
      </div>
    </div>
  );
}