import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck, Loader2, FileText, Sparkles, AlertCircle,
  UploadCloud, CheckCircle2, XCircle,
} from "lucide-react";
import api from "../api";


async function extractText(file) {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(" ") + "\n";
    }
    return text;
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await (mammoth.default || mammoth).extractRawText({ arrayBuffer: buf });
    return value;
  }
  throw new Error("Unsupported file. Please upload a PDF or Word (.docx) file.");
}


function atsScore(text) {
  const t = (text || "").trim();
  const lower = t.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const checks = [];
  const add = (ok, label, tip) => checks.push({ ok, label, tip });

  add(t.length > 150, "File text is machine-readable", "Your file looks scanned/image-based — most ATS can't read it. Export a real text PDF from Word/Docs.");
  add(/[\w.+-]+@[\w-]+\.[\w.-]+/.test(t), "Contains an email address", "Add a professional email address near the top.");
  add(/\+?\d[\d\s().-]{7,}/.test(t), "Contains a phone number", "Add a phone number.");
  add(/experience|employment|work history/i.test(lower), "Has a Work Experience section", "Add a clearly labelled “Experience” section.");
  add(/education|bachelor|master|b\.?sc|b\.?tech|degree|university|college/i.test(lower), "Has an Education section", "Add an “Education” section.");
  add(/skills|technologies|proficient|competen/i.test(lower), "Has a Skills section", "Add a “Skills” section with role-relevant keywords.");
  add(/(\d+%)|(\$\s?\d)|(\d{2,})/.test(t), "Includes measurable results", "Quantify achievements with numbers (e.g. “improved performance by 30%”).");
  add(words.length >= 250 && words.length <= 1000, `Good length (${words.length} words)`,
    words.length < 250 ? "Looks short — aim for roughly 350–700 words." : "Looks long — trim toward 1–2 pages.");
  add(/summary|objective|profile/i.test(lower), "Has a summary / profile", "Add a 2–3 line professional summary at the top.");
  add(/[•‣·]|(^|\n)\s*[-*]\s/.test(t), "Uses bullet points", "Use bullet points for achievements — they're easier to scan.");

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  const grade = score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 45 ? "Fair" : "Poor";
  const color = score >= 85 ? "#15634f" : score >= 70 ? "#d4a23a" : score >= 45 ? "#c6692f" : "#b04a36";
  return { score, grade, color, checks };
}

function ScoreRing({ value, color, size = 92 }) {
  const stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 24 }}>{value}</span>
      </div>
    </div>
  );
}

export default function Checker() {
  const [tab, setTab] = useState("upload");
  const nav = useNavigate();

  
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/resumes").then((r) => {
      setResumes(r.data);
      if (r.data[0]) setSelected(r.data[0]._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const run = async () => {
    if (!selected) return;
    setChecking(true); setFeedback(""); setError("");
    try {
      const full = await api.get(`/resumes/${selected}`);
      const res = await api.post("/ai/review", { data: full.data.data });
      setFeedback(res.data.text || "No feedback returned.");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || "Could not run the check.");
    }
    setChecking(false);
  };

  
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [upErr, setUpErr] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const analyze = async (f) => {
    setUpErr(""); setResult(null); setFile(f); setAnalyzing(true);
    try {
      const text = await extractText(f);
      if (!text || text.trim().length < 30)
        throw new Error("Couldn't read text from this file. If it's a scanned PDF, export a text-based PDF instead.");
      setResult(atsScore(text));
    } catch (e) {
      setUpErr(e.message || "Could not read this file.");
    }
    setAnalyzing(false);
  };

  const onPick = (e) => { const f = e.target.files?.[0]; if (f) analyze(f); };
  const onDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) analyze(f); };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="text-center mb-7">
        <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4">
          <ClipboardCheck className="text-brand" size={28} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Resume Checker</h1>
        <p className="text-ink2 mt-1.5 max-w-lg mx-auto">Upload any resume for an instant ATS score, or get AI feedback on a resume you built here.</p>
      </div>

      {/* tabs */}
      <div className="flex justify-center mb-7">
        <div className="inline-flex rounded-xl border border-line overflow-hidden">
          {[["upload", "Upload & ATS score", UploadCloud], ["saved", "Check a saved resume", FileText]].map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold ${tab === k ? "bg-brand text-white" : "bg-card text-ink2"}`}>
              <Icon size={16} /> <span className="hidden sm:inline">{l}</span><span className="sm:hidden">{k === "upload" ? "Upload" : "Saved"}</span>
            </button>
          ))}
        </div>
      </div>

      
      {tab === "upload" && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition ${drag ? "border-brand bg-brand/5" : "border-line bg-card hover:border-brand"}`}>
            <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onPick} />
            <div className="mx-auto w-12 h-12 grid place-items-center rounded-xl bg-brand/10 mb-3"><UploadCloud className="text-brand" size={24} /></div>
            <p className="font-semibold">{file ? file.name : "Drop your resume here, or click to browse"}</p>
            <p className="text-ink2 text-sm mt-1">PDF or Word (.docx) · analysed privately in your browser</p>
          </div>

          {upErr && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
              <AlertCircle size={18} className="shrink-0 mt-0.5" /> <span>{upErr}</span>
            </div>
          )}

          {analyzing && (
            <div className="mt-5 flex items-center justify-center gap-2 text-ink2 py-8"><Loader2 size={18} className="animate-spin" /> Reading and scoring your resume…</div>
          )}

          {result && !analyzing && (
            <div className="mt-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
              <div className="flex items-center gap-5 pb-5 border-b border-line">
                <ScoreRing value={result.score} color={result.color} />
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-ink2 font-semibold">ATS-friendliness</div>
                  <div className="font-display text-2xl font-semibold" style={{ color: result.color }}>{result.grade}</div>
                  <div className="text-sm text-ink2 mt-0.5">{result.checks.filter((c) => c.ok).length} of {result.checks.length} checks passed</div>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {result.checks.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {c.ok
                      ? <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                      : <XCircle size={18} className="text-rust shrink-0 mt-0.5" />}
                    <div>
                      <span className={`text-sm font-medium ${c.ok ? "text-ink" : "text-ink"}`}>{c.label}</span>
                      {!c.ok && <p className="text-xs text-ink2 mt-0.5">{c.tip}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink2 mt-5 pt-4 border-t border-line">
                This is an automated readability/structure check — a high score means an ATS can parse your resume cleanly. For wording and impact feedback, try the “Check a saved resume” tab.
              </p>
            </div>
          )}
        </>
      )}

     
      {tab === "saved" && (
        loading ? (
          <p className="text-ink2 text-center py-10">Loading your resumes…</p>
        ) : resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card py-14 px-6 text-center">
            <FileText className="text-brand mx-auto mb-3" size={28} />
            <h3 className="font-display text-xl font-semibold mb-1">No resumes yet</h3>
            <p className="text-ink2 mb-5">Create a resume first, then come back to check it.</p>
            <button onClick={() => nav("/dashboard")} className="px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition">Go to dashboard</button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
              <label className="block text-sm font-semibold text-ink2 mb-2">Choose a resume to check</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select value={selected} onChange={(e) => setSelected(e.target.value)}
                  className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition">
                  {resumes.map((r) => <option key={r._id} value={r._id}>{r.title} · {r.template}</option>)}
                </select>
                <button onClick={run} disabled={checking}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition disabled:opacity-60">
                  {checking ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {checking ? "Checking…" : "Run AI check"}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
                <AlertCircle size={18} className="shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}

            {(checking || feedback) && !error && (
              <div className="mt-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-3"><ClipboardCheck size={18} className="text-brand" /> Feedback</h3>
                {checking
                  ? <div className="flex items-center gap-2 text-ink2 py-4"><Loader2 size={18} className="animate-spin" /> Analysing your resume…</div>
                  : <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink2">{feedback}</div>}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}