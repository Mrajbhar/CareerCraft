import { useState, useMemo, useEffect } from "react";
import {
  Brain, Code2, MessageSquare, ExternalLink, Terminal, Boxes, Cpu, Rocket,
  Search, Server, Network, Trophy, Layers, Zap, BookOpen, Check, Shuffle, ChevronRight, GraduationCap, X, Building2,
} from "lucide-react";
import CodeRunner from "../components/CodeRunner";
import { dsaTheory } from "../data/dsaTheory";
import { dsaCourse, learningOrder } from "../data/dsaCourse";
import { companies } from "../data/companies";

const dsaTopics = [
  { name: "Arrays & Hashing", patterns: "Frequency maps, prefix sums, in-place swaps", problems: [["Contains Duplicate", "Easy"], ["Two Sum", "Easy"], ["Group Anagrams", "Medium"], ["Top K Frequent Elements", "Medium"], ["Product of Array Except Self", "Medium"], ["Longest Consecutive Sequence", "Medium"]] },
  { name: "Two Pointers", patterns: "Opposite ends, fast/slow, sorted scans", problems: [["Valid Palindrome", "Easy"], ["Two Sum II", "Medium"], ["3Sum", "Medium"], ["Container With Most Water", "Medium"], ["Trapping Rain Water", "Hard"]] },
  { name: "Sliding Window", patterns: "Expand/contract a window, track the best", problems: [["Best Time to Buy and Sell Stock", "Easy"], ["Longest Substring Without Repeating Characters", "Medium"], ["Longest Repeating Character Replacement", "Medium"], ["Permutation in String", "Medium"], ["Minimum Window Substring", "Hard"]] },
  { name: "Stack", patterns: "Monotonic stack, matching pairs", problems: [["Valid Parentheses", "Easy"], ["Min Stack", "Medium"], ["Evaluate Reverse Polish Notation", "Medium"], ["Daily Temperatures", "Medium"], ["Largest Rectangle in Histogram", "Hard"]] },
  { name: "Binary Search", patterns: "Halve the search space, search on the answer", problems: [["Binary Search", "Easy"], ["Search a 2D Matrix", "Medium"], ["Koko Eating Bananas", "Medium"], ["Search in Rotated Sorted Array", "Medium"], ["Median of Two Sorted Arrays", "Hard"]] },
  { name: "Linked List", patterns: "Dummy nodes, two pointers, cycle detection", problems: [["Reverse Linked List", "Easy"], ["Merge Two Sorted Lists", "Easy"], ["Linked List Cycle", "Easy"], ["Reorder List", "Medium"], ["LRU Cache", "Medium"], ["Merge K Sorted Lists", "Hard"]] },
  { name: "Trees", patterns: "DFS/BFS, recursion, BST invariants", problems: [["Invert Binary Tree", "Easy"], ["Maximum Depth of Binary Tree", "Easy"], ["Diameter of Binary Tree", "Easy"], ["Binary Tree Level Order Traversal", "Medium"], ["Validate Binary Search Tree", "Medium"], ["Binary Tree Maximum Path Sum", "Hard"]] },
  { name: "Tries", patterns: "Prefix trees, fast word lookups", problems: [["Implement Trie (Prefix Tree)", "Medium"], ["Design Add and Search Words", "Medium"], ["Word Search II", "Hard"]] },
  { name: "Heap / Priority Queue", patterns: "Top-K, streaming medians, scheduling", problems: [["Kth Largest Element in a Stream", "Easy"], ["Last Stone Weight", "Easy"], ["K Closest Points to Origin", "Medium"], ["Task Scheduler", "Medium"], ["Find Median from Data Stream", "Hard"]] },
  { name: "Backtracking", patterns: "Choose → explore → un-choose", problems: [["Subsets", "Medium"], ["Combination Sum", "Medium"], ["Permutations", "Medium"], ["Word Search", "Medium"], ["N-Queens", "Hard"]] },
  { name: "Graphs", patterns: "BFS/DFS, union-find, topological sort", problems: [["Number of Islands", "Medium"], ["Clone Graph", "Medium"], ["Course Schedule", "Medium"], ["Pacific Atlantic Water Flow", "Medium"], ["Word Ladder", "Hard"]] },
  { name: "Dynamic Programming", patterns: "Memoize, design the state, build a table", problems: [["Climbing Stairs", "Easy"], ["House Robber", "Medium"], ["Coin Change", "Medium"], ["Longest Increasing Subsequence", "Medium"], ["Longest Common Subsequence", "Medium"], ["Edit Distance", "Hard"]] },
  { name: "Greedy", patterns: "Local optimal choices → global optimum", problems: [["Maximum Subarray", "Medium"], ["Jump Game", "Medium"], ["Gas Station", "Medium"], ["Hand of Straights", "Medium"]] },
  { name: "Intervals", patterns: "Sort by start/end, merge & sweep", problems: [["Insert Interval", "Medium"], ["Merge Intervals", "Medium"], ["Non-overlapping Intervals", "Medium"], ["Meeting Rooms II", "Medium"]] },
  { name: "Bit Manipulation", patterns: "XOR tricks, masks, shifts", problems: [["Single Number", "Easy"], ["Number of 1 Bits", "Easy"], ["Counting Bits", "Easy"], ["Reverse Bits", "Easy"], ["Sum of Two Integers", "Medium"]] },
  { name: "Math & Geometry", patterns: "Matrix moves, number theory", problems: [["Rotate Image", "Medium"], ["Spiral Matrix", "Medium"], ["Set Matrix Zeroes", "Medium"], ["Happy Number", "Easy"]] },
];

const behavioral = [
  { cat: "Teamwork & Conflict", qs: ["Describe a conflict with a teammate and how you resolved it.", "Tell me about a time you worked with a difficult person.", "How do you handle disagreement on a technical decision?"] },
  { cat: "Challenges & Problem-Solving", qs: ["Tell me about a tight deadline and how you handled it.", "Describe the hardest bug you've ever debugged.", "Tell me about a time you had to learn something fast."] },
  { cat: "Ownership & Leadership", qs: ["What project are you most proud of, and why?", "Describe a time you led without formal authority.", "How do you prioritise when everything feels urgent?"] },
  { cat: "Growth & Failure", qs: ["Tell me about a time you failed. What did you learn?", "Describe feedback that was hard to hear.", "Where do you most want to grow next year?"] },
  { cat: "Motivation & Fit", qs: ["Why do you want to work here?", "What kind of work energises you most?", "Walk me through your resume / tell me about yourself."] },
  { cat: "Impact & Decisions", qs: ["Tell me about a decision you made with incomplete data.", "Describe a time you improved a process or system.", "How do you measure the success of your work?"] },
  { cat: "Communication", qs: ["Describe a time you explained something technical to a non-technical person.", "Tell me about a time you had to give difficult feedback.", "How do you keep stakeholders updated on a long project?"] },
  { cat: "Pressure & Adaptability", qs: ["Tell me about a time requirements changed mid-project.", "Describe how you handled being overloaded with work.", "Tell me about a production incident you helped resolve."] },
];

const sysConcepts = [
  ["Scalability", "Horizontal vs vertical scaling, statelessness", Layers],
  ["Load Balancing", "Round-robin, least-connections, health checks", Network],
  ["Caching", "CDN, Redis, cache invalidation, TTLs", Zap],
  ["Databases", "SQL vs NoSQL, indexing, replication, sharding", Server],
  ["Message Queues", "Kafka/RabbitMQ, async work, back-pressure", Boxes],
  ["CAP Theorem", "Consistency / Availability / Partition trade-offs", Brain],
  ["API Design", "REST vs GraphQL, pagination, idempotency", Code2],
  ["Reliability", "Replication, failover, retries, timeouts", Cpu],
  ["Consistent Hashing", "Even key distribution, minimal reshuffles", Network],
  ["Rate Limiting", "Token bucket, leaky bucket, quotas", Zap],
  ["Search & Indexing", "Inverted index, Elasticsearch, ranking", Search],
  ["Observability", "Logs, metrics, traces, alerting, SLOs", Cpu],
];
const sysQuestions = [
  ["Design a URL shortener (TinyURL)", "Hashing, base62, redirects, analytics"],
  ["Design a rate limiter", "Token bucket, sliding window, distributed counters"],
  ["Design a news feed (Twitter / Instagram)", "Fan-out, ranking, timeline caching"],
  ["Design a chat app (WhatsApp)", "WebSockets, delivery receipts, presence"],
  ["Design a file store (Dropbox / Drive)", "Chunking, dedup, sync, metadata"],
  ["Design a ride-hailing app (Uber)", "Geo-indexing, matching, surge pricing"],
  ["Design a video platform (YouTube / Netflix)", "Transcoding, CDN, adaptive streaming"],
  ["Design a typeahead / autocomplete", "Tries, top-K, prefix caching, debounce"],
  ["Design a notification system", "Fan-out, channels, dedup, retries"],
  ["Design a payment system", "Idempotency, ledgers, consistency, reconciliation"],
];

const judges = [
  { name: "LeetCode", desc: "DSA practice with a judge, test cases & solutions", url: "https://leetcode.com/problemset/", icon: Code2, color: "#f59e0b", level: "All levels" },
  { name: "HackerRank", desc: "Skill tracks, certifications & company prep", url: "https://www.hackerrank.com/", icon: Trophy, color: "#15634f", level: "Beginner → Advanced" },
  { name: "Codeforces", desc: "Competitive contests with Elo-style ratings", url: "https://codeforces.com/", icon: Zap, color: "#2dd4bf", level: "Intermediate → Advanced" },
  { name: "CodeChef", desc: "Practice problems & rated contests by difficulty", url: "https://www.codechef.com/", icon: BookOpen, color: "#b45309", level: "Beginner → Advanced" },
];
const ides = [
  { name: "Replit", desc: "Full online IDE — any language, run & deploy", url: "https://replit.com/", icon: Rocket, color: "#f26207" },
  { name: "OneCompiler", desc: "Quick multi-language compiler, no signup", url: "https://onecompiler.com/", icon: Terminal, color: "#2dd4bf" },
  { name: "Programiz", desc: "Beginner-friendly C, Java, Python compiler", url: "https://www.programiz.com/python-programming/online-compiler/", icon: Cpu, color: "#15634f" },
  { name: "CodeSandbox", desc: "Web / JavaScript / React sandbox in-browser", url: "https://codesandbox.io/", icon: Boxes, color: "#d4a23a" },
];

const slugify = (name) =>
  name.toLowerCase().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// LeetCode slugs that differ from the displayed title
const SLUG = {
  "Two Sum II": "two-sum-ii-input-array-is-sorted",
  "Design Add and Search Words": "design-add-and-search-words-data-structure",
};
const lc = (name) => `https://leetcode.com/problems/${SLUG[name] || slugify(name)}/`;
const lcCompany = (name) => `https://leetcode.com/company/${slugify(name)}/`;
const companyCats = ["All", ...Array.from(new Set(companies.map((c) => c.cat)))];
const THEORY_BY_ID = Object.fromEntries(dsaTheory.map((t) => [t.id, t]));
const diffColor = (d) => (d === "Easy" ? "#15634f" : d === "Medium" ? "#c6692f" : "#b3402b");

export default function Prep() {
  const [view, setView] = useState("dsa");
  const [diff, setDiff] = useState("All");
  const [q, setQ] = useState("");
  const [hideSolved, setHideSolved] = useState(false);
  const [randomQ, setRandomQ] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [codeLang, setCodeLang] = useState("Python");
  const [companyQ, setCompanyQ] = useState("");
  const [companyCat, setCompanyCat] = useState("All");
  // solved problems persist across sessions
  const [solved, setSolved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("craftcv_solved")) || {}; } catch { return {}; }
  });
  const toggleSolved = (name) => setSolved((s) => {
    const n = { ...s }; if (n[name]) delete n[name]; else n[name] = true;
    try { localStorage.setItem("craftcv_solved", JSON.stringify(n)); } catch {}
    return n;
  });

  const totalProblems = useMemo(() => dsaTopics.reduce((n, t) => n + t.problems.length, 0), []);
  const solvedCount = useMemo(() => dsaTopics.flatMap((t) => t.problems).filter(([p]) => solved[p]).length, [solved]);
  const allBehavioral = useMemo(() => behavioral.flatMap((b) => b.qs), []);
  const pickRandom = () => setRandomQ(allBehavioral[Math.floor(Math.random() * allBehavioral.length)]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setActiveTopic(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredTopics = useMemo(() => {
    const query = q.trim().toLowerCase();
    return dsaTopics
      .map((t) => ({ ...t, problems: t.problems.filter(([p, d]) => (diff === "All" || d === diff) && p.toLowerCase().includes(query) && (!hideSolved || !solved[p])) }))
      .filter((t) => t.problems.length > 0);
  }, [diff, q, hideSolved, solved]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="text-center mb-7 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Interview Studio</h1>
        <p className="text-ink2 mt-1.5">Master DSA patterns across every level, rehearse behavioral answers, learn system design, and jump into a professional compiler — everything in one place.</p>
      </div>

      {/* tabs */}
      <div className="flex justify-center gap-2 mb-7 flex-wrap">
        {[["dsa", "DSA Topics", Brain], ["theory", "DSA Course", GraduationCap], ["behavioral", "Behavioral", MessageSquare], ["system", "System Design", Network], ["code", "Code Practice", Code2], ["companies", "Companies", Building2]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setView(k)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${view === k ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}>
            <Icon size={16} /> {l}
          </button>
        ))}
      </div>

      {/* ---- DSA ---- */}
      {view === "dsa" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 max-w-5xl mx-auto">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${totalProblems} problems…`}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition" />
            </div>
            <div className="flex gap-1.5">
              {["All", "Easy", "Medium", "Hard"].map((d) => (
                <button key={d} onClick={() => setDiff(d)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${diff === d ? "text-white border-transparent" : "bg-card text-ink2 border-line hover:bg-paper"}`}
                  style={diff === d ? { background: d === "All" ? "#1b1a17" : diffColor(d) } : undefined}>{d}</button>
              ))}
              <button onClick={() => setHideSolved((v) => !v)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${hideSolved ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}>
                {hideSolved ? "Solved hidden" : "Hide solved"}
              </button>
            </div>
          </div>

          {/* progress tracker */}
          <div className="max-w-5xl mx-auto mb-6">
            <div className="flex items-center justify-between text-xs text-ink2 mb-1.5">
              <span className="font-semibold">Your progress</span>
              <span className="font-semibold text-ink">{solvedCount} / {totalProblems} solved · {Math.round((solvedCount / totalProblems) * 100)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-line overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(solvedCount / totalProblems) * 100}%`, background: "linear-gradient(90deg,#18a884,#2dd4bf)", transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredTopics.map((t, idx) => (
              <div key={t.name} className="rounded-2xl border border-line bg-card p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand/10 text-brand font-bold text-sm shrink-0">{idx + 1}</span>
                  <h3 className="font-display text-lg font-semibold leading-tight">{t.name}</h3>
                </div>
                <p className="text-xs text-ink2 mb-3 leading-snug">{t.patterns}</p>
                <div className="flex flex-col gap-2">
                  {t.problems.map(([p, d]) => (
                    <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-paper border border-line hover:border-brand transition group">
                      <button onClick={() => toggleSolved(p)} title={solved[p] ? "Solved — click to undo" : "Mark as solved"}
                        className="shrink-0 grid place-items-center w-5 h-5 rounded-full border transition"
                        style={{ borderColor: solved[p] ? "#18a884" : "var(--color-line)", background: solved[p] ? "#18a884" : "transparent" }}>
                        {solved[p] && <Check size={12} className="text-white" />}
                      </button>
                      <a href={lc(p)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 flex-1 min-w-0">
                        <span className={`text-sm font-medium truncate ${solved[p] ? "line-through text-ink2" : ""}`}>{p}</span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: diffColor(d), background: diffColor(d) + "1a" }}>{d}</span>
                          <ExternalLink size={13} className="text-ink2 group-hover:text-brand transition" />
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {filteredTopics.length === 0 && <p className="text-ink2 text-center py-16">No problems match your search.</p>}
        </>
      )}

      {/* ---- Behavioral ---- */}
      {view === "theory" && (
        <div className="max-w-6xl mx-auto">
          <p className="text-ink2 text-sm mb-4 text-center">A complete DSA course — {dsaCourse.length} modules from programming basics to advanced & competitive topics. Open any module for class-by-class detail, with multi-language code where it applies.</p>
          <div className="rounded-2xl border border-line bg-card p-4 mb-6">
            <div className="text-xs font-semibold text-ink2 mb-2">Recommended learning order</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {learningOrder.map((name, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-paper border border-line text-xs font-semibold">
                  <span className="grid place-items-center w-4 h-4 rounded-full bg-brand text-white text-[9px]">{i + 1}</span>{name}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dsaCourse.map((m) => (
              <button key={m.id} onClick={() => { setActiveTopic(m); setCodeLang("Python"); }}
                className="group text-left rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand font-bold shrink-0">{m.num}</span>
                  <h3 className="font-display text-lg font-semibold leading-tight">{m.title}</h3>
                </div>
                <p className="text-sm text-ink2 leading-snug">{m.summary}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand mt-3 group-hover:gap-2 transition-all">{m.classes.length} classes <ChevronRight size={14} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "behavioral" && (
        <>
          <div className="max-w-3xl mx-auto mb-5 flex items-center gap-3 flex-wrap">
            <button onClick={pickRandom}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark hover:-translate-y-0.5 transition-all shrink-0">
              <Shuffle size={15} /> Random question
            </button>
            {randomQ
              ? <div className="flex-1 min-w-[200px] rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-medium">{randomQ}</div>
              : <span className="text-sm text-ink2">Tap for a surprise prompt to rehearse out loud.</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {behavioral.map((b) => (
              <div key={b.cat} className="rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2"><MessageSquare size={17} className="text-brand" /> {b.cat}</h3>
                <ul className="flex flex-col gap-2.5">
                  {b.qs.map((qq, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-sm leading-relaxed">
                      <span className="shrink-0 grid place-items-center w-5 h-5 rounded bg-rust/10 text-rust font-bold text-[11px] mt-0.5">{i + 1}</span>
                      {qq}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-brand/10 px-5 py-4 text-sm text-brand-dark leading-relaxed mt-4 max-w-3xl mx-auto">
            <strong>Tip — answer with STAR:</strong> Situation, Task, Action, Result. Keep each story under 2 minutes and finish with a measurable result.
          </div>
        </>
      )}

      {/* ---- System Design ---- */}
      {view === "system" && (
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-xl font-semibold mb-1">Core concepts</h2>
          <p className="text-ink2 text-sm mb-4">The building blocks interviewers expect you to reason about.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-9">
            {sysConcepts.map(([name, desc, Icon]) => (
              <div key={name} className="rounded-2xl border border-line bg-card p-5">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 mb-3"><Icon size={20} className="text-brand" /></span>
                <h3 className="font-semibold mb-1">{name}</h3>
                <p className="text-xs text-ink2 leading-snug">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-1">Practice questions</h2>
          <p className="text-ink2 text-sm mb-4">Walk through requirements → high-level design → deep dive → trade-offs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {sysQuestions.map(([title, hint], i) => (
              <div key={title} className="rounded-2xl border border-line bg-card p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="grid place-items-center w-7 h-7 rounded-lg bg-rust/10 text-rust font-bold text-sm shrink-0">{i + 1}</span>
                  <h3 className="font-semibold leading-tight">{title}</h3>
                </div>
                <p className="text-xs text-ink2 leading-snug pl-9">{hint}</p>
              </div>
            ))}
          </div>
          <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-brand hover:underline">
            <BookOpen size={16} /> Deep-dive with the System Design Primer <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* ---- Code Practice ---- */}
      {view === "code" && (
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-xl font-semibold mb-1">Run code right here</h2>
          <p className="text-ink2 text-sm mb-4">Write, highlight and run code in 7 languages with full syntax colors. JS & Python run in your browser; C, C++, Go, Java & C# compile online — no key needed.</p>
          <div className="mb-9"><CodeRunner /></div>

          <h2 className="font-display text-xl font-semibold mb-1">Online judges & contests</h2>
          <p className="text-ink2 text-sm mb-4">Practice with test cases and contests across skill levels — each opens in a new tab.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
            {judges.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                <span className="grid place-items-center w-12 h-12 rounded-xl shrink-0" style={{ background: c.color + "1a" }}><c.icon size={24} style={{ color: c.color }} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-display text-lg font-semibold">{c.name} <ExternalLink size={15} className="text-ink2 group-hover:text-brand transition" /></div>
                  <div className="text-sm text-ink2 leading-snug">{c.desc}</div>
                  <span className="inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">{c.level}</span>
                </div>
              </a>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-1">IDEs & sandboxes</h2>
          <p className="text-ink2 text-sm mb-4">Write and run code in any language right in the browser.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
            {ides.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                <span className="grid place-items-center w-12 h-12 rounded-xl shrink-0" style={{ background: c.color + "1a" }}><c.icon size={24} style={{ color: c.color }} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-display text-lg font-semibold">{c.name} <ExternalLink size={15} className="text-ink2 group-hover:text-brand transition" /></div>
                  <div className="text-sm text-ink2 leading-snug">{c.desc}</div>
                </div>
              </a>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-1">Quick-start problems</h2>
          <p className="text-ink2 text-sm mb-4">Warm up with these — each opens on LeetCode.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {dsaTopics.flatMap((t) => t.problems).slice(0, 12).map(([p, d]) => (
              <a key={p} href={lc(p)} target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-line bg-card hover:border-brand transition group">
                <span className="text-sm font-medium truncate">{p}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: diffColor(d), background: diffColor(d) + "1a" }}>{d}</span>
                  <ExternalLink size={14} className="text-ink2 group-hover:text-brand transition" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {view === "companies" && (
        <div className="max-w-6xl mx-auto">
          <p className="text-ink2 text-sm mb-5 text-center">{companies.length}+ product-based companies known for DSA-heavy interviews — each opens its LeetCode company-tagged problems (some need LeetCode Premium).</p>
          <div className="relative max-w-md mx-auto mb-4">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2" />
            <input value={companyQ} onChange={(e) => setCompanyQ(e.target.value)} placeholder={`Search ${companies.length} companies…`}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition" />
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center mb-6">
            {companyCats.map((cat) => (
              <button key={cat} onClick={() => setCompanyCat(cat)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${companyCat === cat ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}>{cat}</button>
            ))}
          </div>
          {(() => {
            const query = companyQ.trim().toLowerCase();
            const list = companies.filter((c) => (companyCat === "All" || c.cat === companyCat) && c.name.toLowerCase().includes(query));
            if (list.length === 0) return <p className="text-ink2 text-center py-16">No companies match your search.</p>;
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {list.map((c) => (
                  <a key={c.name} href={lcCompany(c.name)} target="_blank" rel="noreferrer"
                    className="group rounded-2xl border border-line bg-card p-4 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand/10 text-brand font-bold text-sm shrink-0">{c.name[0]}</span>
                      <ExternalLink size={14} className="text-ink2 group-hover:text-brand transition shrink-0 mt-1" />
                    </div>
                    <div className="font-semibold text-sm leading-tight">{c.name}</div>
                    <span className="text-[10px] font-semibold text-ink2">{c.cat}</span>
                  </a>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* full-screen course modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-6" style={{ background: "rgba(0,0,0,.65)" }} onClick={() => setActiveTopic(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative bg-card border border-line w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]" style={{ animation: "secUp .25s ease both" }}>
            <div className="flex items-center justify-between gap-3 p-5 border-b border-line shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand font-bold shrink-0">{activeTopic.num}</span>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-semibold truncate">{activeTopic.title}</h2>
                  <p className="text-xs text-ink2 truncate">{activeTopic.summary}</p>
                </div>
              </div>
              <button onClick={() => setActiveTopic(null)} aria-label="Close" className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink shrink-0"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {activeTopic.classes.map((cls, ci) => (
                <div key={ci} className="mb-7">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand shrink-0">Class {ci + 1}</span>
                    <h4 className="font-display text-lg font-semibold">{cls.title}</h4>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {cls.topics.map(([name, detail], ti) => (
                      <div key={ti} className="rounded-xl border border-line bg-paper px-4 py-3">
                        <div className="text-[15px] font-semibold mb-2 text-ink">{name}</div>
                        <ul className="flex flex-col gap-2">
                          {detail.split(/(?<=\.)\s+(?=[A-Z])/).map((line, li) => (
                            <li key={li} className="flex gap-2.5 text-sm leading-6" style={{ color: "#cdd3de" }}>
                              <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-brand" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {activeTopic.codeId && THEORY_BY_ID[activeTopic.codeId]?.examples && (
                <div className="mb-1">
                  <h4 className="font-semibold text-sm mb-2">Code example</h4>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {THEORY_BY_ID[activeTopic.codeId].examples.map((ex) => (
                      <button key={ex.lang} onClick={() => setCodeLang(ex.lang)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${codeLang === ex.lang ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}>{ex.lang}</button>
                    ))}
                  </div>
                  <pre className="rounded-xl p-4 overflow-x-auto text-[12.5px] leading-relaxed" style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    <code>{(THEORY_BY_ID[activeTopic.codeId].examples.find((e) => e.lang === codeLang) || THEORY_BY_ID[activeTopic.codeId].examples[0]).code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes secUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

    </div>
  );
}