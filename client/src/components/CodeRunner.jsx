
import { useState } from "react";
import EditorPkg from "react-simple-code-editor";
const Editor = EditorPkg?.default || EditorPkg; // interop: some bundlers wrap the default export
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism-tomorrow.css";
import { Play, Loader2, RotateCcw, ChevronDown, TerminalSquare, Check, X, CheckCircle2 } from "lucide-react";

const LANGS = [
  { key: "javascript", label: "JavaScript", engine: "js", prism: "javascript", sample: 'console.log("Hello, world!");\n\nfunction twoSum(nums, target) {\n  const seen = {};\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (need in seen) return [seen[need], i];\n    seen[nums[i]] = i;\n  }\n}\nconsole.log(twoSum([2, 7, 11, 15], 9));' },
  { key: "python", label: "Python", engine: "pyodide", prism: "python", sample: 'print("Hello, world!")\n\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n\nprint(two_sum([2, 7, 11, 15], 9))' },
  { key: "c++", label: "C++", engine: "wandbox", prism: "cpp", sample: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}' },
  { key: "c", label: "C", engine: "wandbox", prism: "c", sample: '#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}' },
  { key: "go", label: "Go", engine: "wandbox", prism: "go", sample: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}' },
  { key: "java", label: "Java", engine: "godbolt", prism: "java", sample: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}' },
  { key: "csharp", label: "C#", engine: "godbolt", prism: "csharp", sample: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, world!");\n    }\n}' },
];

/* ---- JavaScript: sandboxed Web Worker ---- */
const WORKER_SRC = `
  const _out = [];
  const _fmt = (a) => { try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); } };
  const _log = (...a) => _out.push(a.map(_fmt).join(' '));
  console.log = _log; console.info = _log; console.warn = _log; console.debug = _log;
  console.error = (...a) => _out.push(a.map(_fmt).join(' '));
  self.onmessage = (e) => {
    const { code, lines } = e.data;
    let _i = 0;
    globalThis.prompt = () => (_i < lines.length ? lines[_i++] : null);
    globalThis.readline = globalThis.prompt;
    try { eval(code); self.postMessage({ ok: true, out: _out }); }
    catch (err) { self.postMessage({ ok: false, out: _out, err: String((err && err.stack) || err) }); }
  };
`;
function runJS(code, stdin) {
  return new Promise((resolve) => {
    const worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: "application/javascript" })));
    const timer = setTimeout(() => { worker.terminate(); resolve({ stdout: "", stderr: "Timed out after 8s (possible infinite loop)." }); }, 8000);
    worker.onmessage = (e) => { clearTimeout(timer); worker.terminate(); const d = e.data; resolve({ stdout: (d.out || []).join("\n"), stderr: d.ok ? "" : (d.err || "") }); };
    worker.onerror = (ev) => { clearTimeout(timer); worker.terminate(); resolve({ stdout: "", stderr: ev.message || "Error" }); };
    worker.postMessage({ code, lines: (stdin || "").split("\n") });
  });
}

/* ---- Python: Pyodide ---- */
const PYODIDE_VER = "v0.26.4";
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src; s.dataset.src = src; s.onload = res; s.onerror = () => rej(new Error("Failed to load Python runtime."));
    document.head.appendChild(s);
  });
}
function getPyodide() {
  if (!window.__pyodidePromise) {
    window.__pyodidePromise = (async () => {
      await loadScript(`https://cdn.jsdelivr.net/pyodide/${PYODIDE_VER}/full/pyodide.js`);
      return window.loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VER}/full/` });
    })();
  }
  return window.__pyodidePromise;
}
const PY_WRAPPER = `import sys, io, traceback
sys.stdin = io.StringIO(_stdin)
_buf = io.StringIO()
_o, _e = sys.stdout, sys.stderr
sys.stdout = _buf
sys.stderr = _buf
try:
    exec(_code, {'__name__': '__main__'})
except SystemExit:
    pass
except Exception:
    traceback.print_exc()
finally:
    sys.stdout, sys.stderr = _o, _e
_result = _buf.getvalue()`;
async function runPython(code, stdin) {
  const py = await getPyodide();
  py.globals.set("_code", code);
  py.globals.set("_stdin", stdin || "");
  await py.runPythonAsync(PY_WRAPPER);
  return { stdout: String(py.globals.get("_result") || ""), stderr: "" };
}

/* ---- C / C++ / Go: Wandbox (free public compiler) ---- */
let wandboxListPromise;
function wandboxList() {
  if (!wandboxListPromise) wandboxListPromise = fetch("https://wandbox.org/api/list.json").then((r) => r.json());
  return wandboxListPromise;
}
async function resolveCompiler(langKey) {
  const list = await wandboxList();
  const find = (pred) => (list.find(pred) || {}).name;
  if (langKey === "c++") return find((c) => c.language === "C++" && /^gcc/.test(c.name)) || find((c) => c.language === "C++");
  if (langKey === "c") return find((c) => c.language === "C" && /^gcc/.test(c.name)) || find((c) => c.language === "C");
  if (langKey === "go") return find((c) => c.language === "Go");
  return null;
}
async function runWandbox(langKey, code, stdin) {
  const compiler = await resolveCompiler(langKey);
  if (!compiler) throw new Error("That compiler isn't available right now — try again later.");
  const res = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compiler, code, stdin: stdin || "" }),
  });
  const d = await res.json();
  const stderr = [d.compiler_error, d.program_error].filter(Boolean).join("\n");
  return { stdout: d.program_output || "", stderr };
}

/* ---- Java / C#: Compiler Explorer (godbolt) — free, no key ---- */
const GODBOLT = "https://godbolt.org/api";
const _gbCache = {};
async function gbCompiler(lang) {
  if (_gbCache[lang]) return _gbCache[lang];
  const res = await fetch(`${GODBOLT}/compilers/${lang}?fields=id,name,supportsExecute`, { headers: { Accept: "application/json" } });
  const list = await res.json();
  const exec = list.filter((c) => c.supportsExecute);
  const pick = exec[exec.length - 1] || exec[0];
  if (!pick) throw new Error("No runnable compiler available right now.");
  _gbCache[lang] = pick.id;
  return pick.id;
}
async function runGodbolt(lang, code, stdin) {
  const id = await gbCompiler(lang);
  const res = await fetch(`${GODBOLT}/compiler/${id}/compile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      source: code, compiler: id, lang, allowStoreCodeDebug: true,
      options: {
        userArguments: "",
        executeParameters: { args: [], stdin: stdin || "" },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [], libraries: [],
      },
    }),
  });
  if (!res.ok) throw new Error("Compiler service request failed (" + res.status + ").");
  const d = await res.json();
  const stdout = (d.stdout || []).map((l) => l.text).join("\n");
  const compileErr = ((d.buildResult && d.buildResult.stderr) || []).map((l) => l.text).join("\n");
  const runErr = (d.stderr || []).map((l) => l.text).join("\n");
  return { stdout, stderr: [compileErr, runErr].filter(Boolean).join("\n") };
}

function buildHarness(func, tests) {
  const json = JSON.stringify(tests.map((t) => [t.args, t.expected]));
  return [
    "import json as _json",
    "def _norm(x):",
    "    if isinstance(x, bool): return x",
    "    if isinstance(x, list):",
    "        try: return sorted((_norm(i) for i in x), key=lambda v: _json.dumps(v, sort_keys=True))",
    "        except Exception: return [_norm(i) for i in x]",
    "    return x",
    "_cases = _json.loads(r + json + )",
    "_passed = 0",
    "for _i, _c in enumerate(_cases):",
    "    _args, _exp = _c[0], _c[1]",
    "    try:",
    "        _got = " + func + "(*_args)",
    "        _ok = _norm(_got) == _norm(_exp)",
    "    except Exception as _e:",
    "        _ok = False; _got = 'ERROR: ' + str(_e)",
    "    print('__T%d:%s|got=%s|exp=%s' % (_i, 'PASS' if _ok else 'FAIL', repr(_got), repr(_exp)))",
    "    if _ok: _passed += 1",
    "print('__SUMMARY:%d/%d' % (_passed, len(_cases)))",
  ].join("\n");
}

function parseVerdict(stdout) {
  const cases = [];
  let passed = 0, total = 0;
  for (const ln of (stdout || "").split("\n")) {
    if (ln.startsWith("__T")) {
      const m = ln.match(/^__T(\d+):(PASS|FAIL)\|got=([\s\S]*?)\|exp=([\s\S]*)$/);
      if (m) cases.push({ i: +m[1], ok: m[2] === "PASS", got: m[3], exp: m[4] });
    } else if (ln.startsWith("__SUMMARY:")) {
      const m = ln.match(/^__SUMMARY:(\d+)\/(\d+)$/);
      if (m) { passed = +m[1]; total = +m[2]; }
    }
  }
  if (!total && cases.length) { total = cases.length; passed = cases.filter((c) => c.ok).length; }
  return { passed, total, cases, accepted: total > 0 && passed === total };
}

export default function CodeRunner({ initialCode, initialLangKey, tests, funcName, onResult } = {}) {
  const startKey = initialLangKey && LANGS.some((l) => l.key === initialLangKey) ? initialLangKey : "javascript";
  const [langKey, setLangKey] = useState(startKey);
  const [code, setCode] = useState(initialCode ?? (LANGS.find((l) => l.key === startKey)?.sample || LANGS[0].sample));
  const [stdin, setStdin] = useState("");
  const [out, setOut] = useState(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [showStdin, setShowStdin] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const canJudge = Array.isArray(tests) && tests.length > 0 && !!funcName;

  const lang = LANGS.find((l) => l.key === langKey);
  const pickLang = (k) => { setLangKey(k); setCode(LANGS.find((l) => l.key === k).sample); setOut(null); setErr(""); setVerdict(null); };
  const reset = () => { setCode(lang.sample); setOut(null); setErr(""); setStdin(""); setVerdict(null); };

  const run = async () => {
    setRunning(true); setOut(null); setErr(""); setStatus("");
    try {
      let r;
      if (lang.engine === "js") r = await runJS(code, stdin);
      else if (lang.engine === "pyodide") { setStatus("Loading Python runtime (first run only)…"); r = await runPython(code, stdin); setStatus(""); }
      else if (lang.engine === "wandbox") { setStatus("Compiling & running…"); r = await runWandbox(langKey, code, stdin); setStatus(""); }
      else { setStatus("Compiling & running…"); r = await runGodbolt(lang.key, code, stdin); setStatus(""); }
      setOut({ stdout: r.stdout, stderr: r.stderr, code: r.stderr ? 1 : 0 });
    } catch (e) {
      setErr(String((e && e.message) || e));
    }
    setStatus(""); setRunning(false);
  };

  const runTests = async (record = true) => {
    if (!canJudge || langKey !== "python") return;
    setRunning(true); setOut(null); setErr(""); setVerdict(null);
    try {
      setStatus("Loading Python runtime (first run only)…");
      const r = await runPython(code + "\n\n" + buildHarness(funcName, tests), "");
      setStatus("");
      const v = parseVerdict(r.stdout || "");
      setVerdict(v);
      if (v.total > 0 && onResult && record) onResult(v.accepted ? "Accepted" : "Wrong Answer");
      if (!v.total && r.stderr) setErr(r.stderr);
    } catch (e) {
      setErr(String((e && e.message) || e));
    }
    setStatus(""); setRunning(false);
  };

  const hl = (c) => highlight(c, languages[lang.prism] || languages.clike, lang.prism);

  return (
    <div className="rounded-2xl border border-line overflow-hidden bg-card">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-line flex-wrap">
        <div className="relative">
          <button onClick={() => setLangOpen((v) => !v)}
            className="appearance-none rounded-lg border border-line pl-3 pr-8 py-2 text-sm font-semibold outline-none cursor-pointer hover:border-brand transition-colors"
            style={{ background: "#161922", color: "var(--color-ink)" }}>
            {lang.label}
          </button>
          <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink2 pointer-events-none transition-transform" style={{ transform: langOpen ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)" }} />
          {langOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              <div className="absolute z-20 mt-1.5 w-44 rounded-xl border border-white/12 overflow-hidden shadow-2xl py-1"
                style={{ background: "#161922" }}>
                {LANGS.map((l) => (
                  <button key={l.key} onClick={() => { pickLang(l.key); setLangOpen(false); }}
                    className="w-full flex items-center justify-between gap-2 text-left px-3 py-2 text-sm font-semibold transition-colors"
                    style={{ color: l.key === langKey ? "#18a884" : "#cfd4de", background: l.key === langKey ? "rgba(24,168,132,.12)" : "transparent" }}
                    onMouseEnter={(e) => { if (l.key !== langKey) e.currentTarget.style.background = "rgba(255,255,255,.06)"; }}
                    onMouseLeave={(e) => { if (l.key !== langKey) e.currentTarget.style.background = "transparent"; }}>
                    {l.label}{l.key === langKey && <Check size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button onClick={() => setShowStdin((v) => !v)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${showStdin ? "bg-brand text-white border-brand" : "bg-white text-ink2 border-line hover:bg-paper"}`}>Input</button>
        <div className="flex-1" />
        <button onClick={reset} title="Reset" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-white text-ink2 text-sm font-semibold hover:bg-paper transition">
          <RotateCcw size={15} /> <span className="hidden sm:inline">Reset</span>
        </button>
        <button onClick={() => (canJudge && langKey === "python" ? runTests(false) : run())} disabled={running}
          title={canJudge && langKey === "python" ? "Run against the test cases" : "Run your code"}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line bg-paper text-ink text-sm font-semibold hover:bg-card transition disabled:opacity-60">
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} {running ? "Running…" : "Run"}
        </button>
        {canJudge && langKey === "python" && (
          <button onClick={() => runTests(true)} disabled={running} title="Submit — judge all test cases and save your result"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-60">
            <CheckCircle2 size={16} /> Submit
          </button>
        )}
      </div>

      {showStdin && (
        <div className="px-3 sm:px-4 py-2.5 border-b border-line bg-paper">
          <label className="text-xs font-semibold text-ink2">Standard input (stdin)</label>
          <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={2} placeholder="Optional input passed to your program…"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-mono outline-none focus:border-brand resize-y" />
        </div>
      )}

      {verdict && (
        <div className="px-3 sm:px-4 py-3 border-b border-line" style={{ background: verdict.accepted ? "rgba(24,168,132,.08)" : "rgba(224,116,58,.08)" }}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {verdict.accepted ? <CheckCircle2 size={18} className="text-brand" /> : <X size={18} style={{ color: "#e0743a" }} />}
            <span className="font-bold" style={{ color: verdict.accepted ? "#18a884" : "#e0743a" }}>{verdict.accepted ? "Accepted" : verdict.total ? "Wrong Answer" : "No result"}</span>
            {verdict.total > 0 && <span className="text-sm font-bold" style={{ color: verdict.accepted ? "#18a884" : "#e0743a" }}>· {verdict.passed} / {verdict.total} test cases passed</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {verdict.cases.map((c) => (
              <span key={c.i} title={c.ok ? "Passed" : `got ${c.got} · expected ${c.exp}`}
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: c.ok ? "#18a884" : "#e0743a", background: (c.ok ? "#18a884" : "#e0743a") + "1a" }}>
                Case {c.i + 1} {c.ok ? "\u2713" : "\u2717"}
              </span>
            ))}
          </div>
          {!verdict.accepted && verdict.cases.find((c) => !c.ok) && (
            <div className="mt-2 text-xs text-ink2" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              First failing → got: {verdict.cases.find((c) => !c.ok).got} · expected: {verdict.cases.find((c) => !c.ok).exp}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2">
        <div className="relative overflow-auto" style={{ background: "#1b1a17", maxHeight: 480 }}>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={hl}
            padding={16}
            tabSize={2}
            insertSpaces
            textareaClassName="outline-none"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, lineHeight: 1.6, minHeight: 300, color: "#f3efe6" }}
          />
          <span className="absolute top-2 right-3 text-[10px] uppercase tracking-wide text-white/40 pointer-events-none">{lang.label}</span>
        </div>
        <div className="border-t lg:border-t-0 lg:border-l border-line flex flex-col" style={{ background: "#14130f" }}>
          <div className="flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-wide text-white/45 border-b border-white/10"><TerminalSquare size={13} /> Output</div>
          <div className="p-4 font-mono text-[13px] leading-relaxed overflow-auto h-[260px] sm:h-[380px]">
            {running ? (
              <div className="flex items-center gap-2 text-white/60"><Loader2 size={15} className="animate-spin" /> {status || "Executing…"}</div>
            ) : err ? (
              <span style={{ color: "#f0a58f" }}>{err}</span>
            ) : out ? (
              <>
                {out.stdout && <pre className="whitespace-pre-wrap" style={{ color: "#e6ddcc", margin: 0 }}>{out.stdout}</pre>}
                {out.stderr && <pre className="whitespace-pre-wrap" style={{ color: "#f0a58f", margin: 0 }}>{out.stderr}</pre>}
                {!out.stdout && !out.stderr && <span className="text-white/40">Program finished with no output.</span>}
                <div className="mt-2 text-[11px] text-white/35">Exit code: {out.code}</div>
              </>
            ) : (
              <span className="text-white/35">Press <strong className="text-white/60">Run</strong> (or Ctrl/⌘ + Enter) to execute your code.</span>
            )}
          </div>
        </div>
      </div>

      {Array.isArray(tests) && tests.length > 0 && (
        <div className="px-3 sm:px-4 py-3 border-t border-line">
          <div className="text-xs font-semibold text-ink2 mb-2 flex items-center gap-2">
            <span>Test cases</span>
            {verdict?.total > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: verdict.accepted ? "#18a884" : "#e0743a", background: (verdict.accepted ? "#18a884" : "#e0743a") + "1a" }}>
                {verdict.passed}/{verdict.total} passed
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {tests.map((tc, i) => {
              const res = verdict?.cases?.find((c) => c.i === i);
              const status = res ? (res.ok ? "pass" : "fail") : null;
              return (
                <div key={i} className="rounded-lg border border-line bg-paper/40 p-2.5 text-[12px]" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-ink text-[12px]" style={{ fontFamily: "var(--font-sans)" }}>Case {i + 1}</span>
                    {status === "pass" && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: "#18a884", background: "#18a8841a" }}>Passed &#10003;</span>}
                    {status === "fail" && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: "#e0743a", background: "#e0743a1a" }}>Failed &#10007;</span>}
                  </div>
                  <div className="text-ink2 break-words">Input: <span className="text-ink">{tc.args.map((a) => JSON.stringify(a)).join(", ")}</span></div>
                  <div className="text-ink2 break-words">Expected: <span className="text-ink">{JSON.stringify(tc.expected)}</span></div>
                  {status === "fail" && res && <div className="text-ink2 mt-0.5 break-words">Got: <span style={{ color: "#e0743a" }}>{res.got}</span></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}