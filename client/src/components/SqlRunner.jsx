import { useState } from "react";
import { Play, Loader2, RotateCcw, CheckCircle2, X, Database } from "lucide-react";

const SQL_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2";
let _scriptPromise = null;

function loadSql() {
  const init = () => window.initSqlJs({ locateFile: (f) => `${SQL_CDN}/${f}` });
  if (window.initSqlJs) return init();
  if (!_scriptPromise) {
    _scriptPromise = new Promise((resolve, reject) => {
      const sc = document.createElement("script");
      sc.src = `${SQL_CDN}/sql-wasm.js`;
      sc.onload = () => resolve();
      sc.onerror = () => reject(new Error("Could not load the SQL engine (check your connection)."));
      document.head.appendChild(sc);
    });
  }
  return _scriptPromise.then(init);
}

const normRow = (r) => JSON.stringify(r.map((v) => (v === null || v === undefined ? null : v)));

function judge(values, expected, ordered) {
  const got = values.map(normRow);
  const exp = expected.map(normRow);
  if (got.length !== exp.length) return false;
  if (ordered) return got.every((g, i) => g === exp[i]);
  const gs = [...got].sort();
  const es = [...exp].sort();
  return gs.every((g, i) => g === es[i]);
}

export default function SqlRunner({ schema, expected, ordered = false, starter = "-- Write your SQL query here\n" }) {
  const [code, setCode] = useState(starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null); // { columns, values }
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("");
  const [verdict, setVerdict] = useState(null); // { accepted }

  const execute = async () => {
    setErr(""); setResult(null); setVerdict(null);
    const SQL = await loadSql();
    const db = new SQL.Database();
    try {
      db.run(schema);
      const res = db.exec(code);
      const out = res.length ? res[res.length - 1] : { columns: [], values: [] };
      return out;
    } finally {
      db.close();
    }
  };

  const run = async () => {
    setRunning(true); setStatus("Loading SQL engine (first run only)…");
    try { const out = await execute(); setStatus(""); setResult(out); }
    catch (e) { setStatus(""); setErr(String(e.message || e)); }
    setRunning(false);
  };

  const submit = async () => {
    setRunning(true); setStatus("Loading SQL engine (first run only)…");
    try {
      const out = await execute();
      setStatus(""); setResult(out);
      setVerdict({ accepted: judge(out.values || [], expected, ordered) });
    } catch (e) { setStatus(""); setErr(String(e.message || e)); }
    setRunning(false);
  };

  const reset = () => { setCode(starter); setResult(null); setErr(""); setVerdict(null); };

  return (
    <div className="rounded-2xl border border-line overflow-hidden bg-card">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink2"><Database size={14} /> SQLite</span>
        <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-ink2 hover:text-ink transition"><RotateCcw size={13} /> Reset</button>
      </div>

      <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} rows={7}
        className="w-full px-4 py-3 bg-transparent text-ink text-[13px] outline-none resize-y"
        style={{ fontFamily: "ui-monospace, Menlo, monospace" }} />

      <div className="flex items-center gap-2 px-3 py-2 border-t border-line flex-wrap">
        <button onClick={run} disabled={running}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-60">
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} Run
        </button>
        <button onClick={submit} disabled={running}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
          <CheckCircle2 size={16} /> Submit
        </button>
        {status && <span className="text-xs text-ink2">{status}</span>}
      </div>

      {verdict && (
        <div className="px-4 py-2.5 border-t border-line flex items-center gap-2" style={{ background: verdict.accepted ? "rgba(24,168,132,.08)" : "rgba(224,116,58,.08)" }}>
          {verdict.accepted ? <CheckCircle2 size={18} className="text-brand" /> : <X size={18} style={{ color: "#e0743a" }} />}
          <span className="font-bold" style={{ color: verdict.accepted ? "#18a884" : "#e0743a" }}>{verdict.accepted ? "Accepted" : "Wrong Answer"}</span>
          {!verdict.accepted && <span className="text-ink2 text-sm">· your result doesn't match the expected rows</span>}
        </div>
      )}

      {err && <div className="px-4 py-3 border-t border-line text-sm text-rust" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{err}</div>}

      {result && !err && (
        <div className="border-t border-line overflow-x-auto">
          {result.columns?.length ? (
            <table className="w-full text-[13px]" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              <thead>
                <tr className="text-left text-ink2 border-b border-line">
                  {result.columns.map((c, i) => <th key={i} className="px-3 py-2 font-semibold">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.values.map((row, ri) => (
                  <tr key={ri} className="border-b border-line/60">
                    {row.map((v, ci) => <td key={ci} className="px-3 py-1.5 text-ink">{v === null ? <span className="text-ink2 italic">NULL</span> : String(v)}</td>)}
                  </tr>
                ))}
                {result.values.length === 0 && <tr><td className="px-3 py-2 text-ink2" colSpan={result.columns.length}>0 rows</td></tr>}
              </tbody>
            </table>
          ) : (
            <div className="px-4 py-3 text-sm text-ink2">Query ran — no rows returned.</div>
          )}
        </div>
      )}
    </div>
  );
}