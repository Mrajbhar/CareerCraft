import { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import UpgradeModal from "../components/UpgradeModal";
import {
  Brain,
  Code2,
  MessageSquare,
  ExternalLink,
  Terminal,
  Boxes,
  Cpu,
  Rocket,
  Search,
  Server,
  Network,
  Trophy,
  Layers,
  Zap,
  BookOpen,
  Check,
  Shuffle,
  ChevronRight,
  GraduationCap,
  X,
  Building2,
  Mic,
  Crown,
  Send,
  RotateCcw,
  Loader2,
  Timer,
  Lightbulb,
  Database,
} from "lucide-react";
import CodeRunner from "../components/CodeRunner";
import SqlRunner from "../components/SqlRunner";
import { dsaTheory } from "../data/dsaTheory";
import { dsaCourse, learningOrder } from "../data/dsaCourse";
import { dsaProblems } from "../data/dsaProblems";
import { sysDesign } from "../data/sysDesign";
import { sqlProblems } from "../data/sqlProblems";
import { companies } from "../data/companies";

const dsaTopics = [
  {
    name: "Arrays & Hashing",
    patterns: "Frequency maps, prefix sums, in-place swaps",
    problems: [
      ["Contains Duplicate", "Easy"],
      ["Two Sum", "Easy"],
      ["Valid Anagram", "Easy"],
      ["Concatenation of Array", "Easy"],
      ["Replace Elements with Greatest Element on Right Side", "Easy"],
      ["Is Subsequence", "Easy"],
      ["Longest Common Prefix", "Easy"],
      ["Majority Element", "Easy"],
      ["Group Anagrams", "Medium"],
      ["Top K Frequent Elements", "Medium"],
      ["Product of Array Except Self", "Medium"],
      ["Valid Sudoku", "Medium"],
      ["Encode and Decode Strings", "Medium"],
      ["Longest Consecutive Sequence", "Medium"],
      ["Sort Colors", "Medium"],
      ["Subarray Sum Equals K", "Medium"],
      ["First Missing Positive", "Hard"],
    ],
  },
  {
    name: "Two Pointers",
    patterns: "Opposite ends, fast/slow, sorted scans",
    problems: [
      ["Valid Palindrome", "Easy"],
      ["Valid Palindrome II", "Easy"],
      ["Move Zeroes", "Easy"],
      ["Remove Duplicates from Sorted Array", "Easy"],
      ["Two Sum II", "Medium"],
      ["3Sum", "Medium"],
      ["4Sum", "Medium"],
      ["Container With Most Water", "Medium"],
      ["Boats to Save People", "Medium"],
      ["Trapping Rain Water", "Hard"],
    ],
  },
  {
    name: "Sliding Window",
    patterns: "Expand/contract a window, track the best",
    problems: [
      ["Best Time to Buy and Sell Stock", "Easy"],
      ["Maximum Average Subarray I", "Easy"],
      ["Longest Substring Without Repeating Characters", "Medium"],
      ["Longest Repeating Character Replacement", "Medium"],
      ["Permutation in String", "Medium"],
      ["Fruit Into Baskets", "Medium"],
      ["Minimum Size Subarray Sum", "Medium"],
      ["Minimum Window Substring", "Hard"],
      ["Sliding Window Maximum", "Hard"],
    ],
  },
  {
    name: "Stack",
    patterns: "Monotonic stack, matching pairs",
    problems: [
      ["Valid Parentheses", "Easy"],
      ["Implement Queue using Stacks", "Easy"],
      ["Min Stack", "Medium"],
      ["Evaluate Reverse Polish Notation", "Medium"],
      ["Generate Parentheses", "Medium"],
      ["Daily Temperatures", "Medium"],
      ["Car Fleet", "Medium"],
      ["Asteroid Collision", "Medium"],
      ["Decode String", "Medium"],
      ["Largest Rectangle in Histogram", "Hard"],
    ],
  },
  {
    name: "Binary Search",
    patterns: "Halve the search space, search on the answer",
    problems: [
      ["Binary Search", "Easy"],
      ["Guess Number Higher or Lower", "Easy"],
      ["Sqrt(x)", "Easy"],
      ["Search a 2D Matrix", "Medium"],
      ["Koko Eating Bananas", "Medium"],
      ["Find Minimum in Rotated Sorted Array", "Medium"],
      ["Search in Rotated Sorted Array", "Medium"],
      ["Find Peak Element", "Medium"],
      ["Time Based Key-Value Store", "Medium"],
      ["Median of Two Sorted Arrays", "Hard"],
    ],
  },
  {
    name: "Linked List",
    patterns: "Dummy nodes, two pointers, cycle detection",
    problems: [
      ["Reverse Linked List", "Easy"],
      ["Merge Two Sorted Lists", "Easy"],
      ["Linked List Cycle", "Easy"],
      ["Palindrome Linked List", "Easy"],
      ["Remove Nth Node From End of List", "Medium"],
      ["Reorder List", "Medium"],
      ["Copy List with Random Pointer", "Medium"],
      ["Add Two Numbers", "Medium"],
      ["Find the Duplicate Number", "Medium"],
      ["LRU Cache", "Medium"],
      ["Merge K Sorted Lists", "Hard"],
      ["Reverse Nodes in k-Group", "Hard"],
    ],
  },
  {
    name: "Trees",
    patterns: "DFS/BFS, recursion, BST invariants",
    problems: [
      ["Invert Binary Tree", "Easy"],
      ["Maximum Depth of Binary Tree", "Easy"],
      ["Diameter of Binary Tree", "Easy"],
      ["Balanced Binary Tree", "Easy"],
      ["Same Tree", "Easy"],
      ["Subtree of Another Tree", "Easy"],
      ["Lowest Common Ancestor of a BST", "Medium"],
      ["Binary Tree Level Order Traversal", "Medium"],
      ["Binary Tree Right Side View", "Medium"],
      ["Count Good Nodes in Binary Tree", "Medium"],
      ["Validate Binary Search Tree", "Medium"],
      ["Kth Smallest Element in a BST", "Medium"],
      ["Construct Binary Tree from Preorder and Inorder Traversal", "Medium"],
      ["Binary Tree Maximum Path Sum", "Hard"],
      ["Serialize and Deserialize Binary Tree", "Hard"],
    ],
  },
  {
    name: "Tries",
    patterns: "Prefix trees, fast word lookups",
    problems: [
      ["Implement Trie (Prefix Tree)", "Medium"],
      ["Design Add and Search Words Data Structure", "Medium"],
      ["Word Search II", "Hard"],
    ],
  },
  {
    name: "Heap / Priority Queue",
    patterns: "Top-K, streaming medians, scheduling",
    problems: [
      ["Kth Largest Element in a Stream", "Easy"],
      ["Last Stone Weight", "Easy"],
      ["K Closest Points to Origin", "Medium"],
      ["Kth Largest Element in an Array", "Medium"],
      ["Task Scheduler", "Medium"],
      ["Design Twitter", "Medium"],
      ["Find Median from Data Stream", "Hard"],
    ],
  },
  {
    name: "Backtracking",
    patterns: "Choose → explore → un-choose",
    problems: [
      ["Subsets", "Medium"],
      ["Subsets II", "Medium"],
      ["Combination Sum", "Medium"],
      ["Combination Sum II", "Medium"],
      ["Permutations", "Medium"],
      ["Word Search", "Medium"],
      ["Palindrome Partitioning", "Medium"],
      ["Letter Combinations of a Phone Number", "Medium"],
      ["N-Queens", "Hard"],
    ],
  },
  {
    name: "Graphs",
    patterns: "BFS/DFS, union-find, topological sort",
    problems: [
      ["Number of Islands", "Medium"],
      ["Max Area of Island", "Medium"],
      ["Clone Graph", "Medium"],
      ["Walls and Gates", "Medium"],
      ["Rotting Oranges", "Medium"],
      ["Pacific Atlantic Water Flow", "Medium"],
      ["Surrounded Regions", "Medium"],
      ["Course Schedule", "Medium"],
      ["Course Schedule II", "Medium"],
      ["Graph Valid Tree", "Medium"],
      ["Number of Connected Components in an Undirected Graph", "Medium"],
      ["Redundant Connection", "Medium"],
      ["Word Ladder", "Hard"],
    ],
  },
  {
    name: "Advanced Graphs",
    patterns: "Dijkstra, MST, topological order",
    problems: [
      ["Network Delay Time", "Medium"],
      ["Cheapest Flights Within K Stops", "Medium"],
      ["Min Cost to Connect All Points", "Medium"],
      ["Reconstruct Itinerary", "Hard"],
      ["Swim in Rising Water", "Hard"],
      ["Alien Dictionary", "Hard"],
    ],
  },
  {
    name: "1-D Dynamic Programming",
    patterns: "Memoize, design the state, build a table",
    problems: [
      ["Climbing Stairs", "Easy"],
      ["Min Cost Climbing Stairs", "Easy"],
      ["House Robber", "Medium"],
      ["House Robber II", "Medium"],
      ["Longest Palindromic Substring", "Medium"],
      ["Palindromic Substrings", "Medium"],
      ["Decode Ways", "Medium"],
      ["Coin Change", "Medium"],
      ["Maximum Product Subarray", "Medium"],
      ["Word Break", "Medium"],
      ["Longest Increasing Subsequence", "Medium"],
      ["Partition Equal Subset Sum", "Medium"],
    ],
  },
  {
    name: "2-D Dynamic Programming",
    patterns: "Grids, two sequences, knapsack",
    problems: [
      ["Unique Paths", "Medium"],
      ["Longest Common Subsequence", "Medium"],
      ["Best Time to Buy and Sell Stock with Cooldown", "Medium"],
      ["Coin Change II", "Medium"],
      ["Target Sum", "Medium"],
      ["Interleaving String", "Medium"],
      ["Edit Distance", "Hard"],
      ["Distinct Subsequences", "Hard"],
      ["Burst Balloons", "Hard"],
      ["Regular Expression Matching", "Hard"],
    ],
  },
  {
    name: "Greedy",
    patterns: "Local optimal choices → global optimum",
    problems: [
      ["Maximum Subarray", "Medium"],
      ["Jump Game", "Medium"],
      ["Jump Game II", "Medium"],
      ["Gas Station", "Medium"],
      ["Hand of Straights", "Medium"],
      ["Merge Triplets to Form Target Triplet", "Medium"],
      ["Partition Labels", "Medium"],
      ["Valid Parenthesis String", "Medium"],
    ],
  },
  {
    name: "Intervals",
    patterns: "Sort by start/end, merge & sweep",
    problems: [
      ["Meeting Rooms", "Easy"],
      ["Insert Interval", "Medium"],
      ["Merge Intervals", "Medium"],
      ["Non-overlapping Intervals", "Medium"],
      ["Meeting Rooms II", "Medium"],
      ["Minimum Interval to Include Each Query", "Hard"],
    ],
  },
  {
    name: "Bit Manipulation",
    patterns: "XOR tricks, masks, shifts",
    problems: [
      ["Single Number", "Easy"],
      ["Number of 1 Bits", "Easy"],
      ["Counting Bits", "Easy"],
      ["Reverse Bits", "Easy"],
      ["Missing Number", "Easy"],
      ["Sum of Two Integers", "Medium"],
      ["Reverse Integer", "Medium"],
    ],
  },
  {
    name: "Math & Geometry",
    patterns: "Matrix moves, number theory",
    problems: [
      ["Happy Number", "Easy"],
      ["Plus One", "Easy"],
      ["Rotate Image", "Medium"],
      ["Spiral Matrix", "Medium"],
      ["Set Matrix Zeroes", "Medium"],
      ["Pow(x, n)", "Medium"],
      ["Multiply Strings", "Medium"],
      ["Detect Squares", "Medium"],
    ],
  },
];

const behavioral = [
  {
    cat: "Teamwork & Conflict",
    qs: [
      "Describe a conflict with a teammate and how you resolved it.",
      "Tell me about a time you worked with a difficult person.",
      "How do you handle disagreement on a technical decision?",
    ],
  },
  {
    cat: "Challenges & Problem-Solving",
    qs: [
      "Tell me about a tight deadline and how you handled it.",
      "Describe the hardest bug you've ever debugged.",
      "Tell me about a time you had to learn something fast.",
    ],
  },
  {
    cat: "Ownership & Leadership",
    qs: [
      "What project are you most proud of, and why?",
      "Describe a time you led without formal authority.",
      "How do you prioritise when everything feels urgent?",
    ],
  },
  {
    cat: "Growth & Failure",
    qs: [
      "Tell me about a time you failed. What did you learn?",
      "Describe feedback that was hard to hear.",
      "Where do you most want to grow next year?",
    ],
  },
  {
    cat: "Motivation & Fit",
    qs: [
      "Why do you want to work here?",
      "What kind of work energises you most?",
      "Walk me through your resume / tell me about yourself.",
    ],
  },
  {
    cat: "Impact & Decisions",
    qs: [
      "Tell me about a decision you made with incomplete data.",
      "Describe a time you improved a process or system.",
      "How do you measure the success of your work?",
    ],
  },
  {
    cat: "Communication",
    qs: [
      "Describe a time you explained something technical to a non-technical person.",
      "Tell me about a time you had to give difficult feedback.",
      "How do you keep stakeholders updated on a long project?",
    ],
  },
  {
    cat: "Pressure & Adaptability",
    qs: [
      "Tell me about a time requirements changed mid-project.",
      "Describe how you handled being overloaded with work.",
      "Tell me about a production incident you helped resolve.",
    ],
  },
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
  [
    "Design a rate limiter",
    "Token bucket, sliding window, distributed counters",
  ],
  [
    "Design a news feed (Twitter / Instagram)",
    "Fan-out, ranking, timeline caching",
  ],
  ["Design a chat app (WhatsApp)", "WebSockets, delivery receipts, presence"],
  ["Design a file store (Dropbox / Drive)", "Chunking, dedup, sync, metadata"],
  ["Design a ride-hailing app (Uber)", "Geo-indexing, matching, surge pricing"],
  [
    "Design a video platform (YouTube / Netflix)",
    "Transcoding, CDN, adaptive streaming",
  ],
  [
    "Design a typeahead / autocomplete",
    "Tries, top-K, prefix caching, debounce",
  ],
  ["Design a notification system", "Fan-out, channels, dedup, retries"],
  [
    "Design a payment system",
    "Idempotency, ledgers, consistency, reconciliation",
  ],
];

const judges = [
  {
    name: "LeetCode",
    desc: "DSA practice with a judge, test cases & solutions",
    url: "https://leetcode.com/problemset/",
    icon: Code2,
    color: "#f59e0b",
    level: "All levels",
  },
  {
    name: "HackerRank",
    desc: "Skill tracks, certifications & company prep",
    url: "https://www.hackerrank.com/",
    icon: Trophy,
    color: "#15634f",
    level: "Beginner → Advanced",
  },
  {
    name: "Codeforces",
    desc: "Competitive contests with Elo-style ratings",
    url: "https://codeforces.com/",
    icon: Zap,
    color: "#2dd4bf",
    level: "Intermediate → Advanced",
  },
  {
    name: "CodeChef",
    desc: "Practice problems & rated contests by difficulty",
    url: "https://www.codechef.com/",
    icon: BookOpen,
    color: "#b45309",
    level: "Beginner → Advanced",
  },
];
const ides = [
  {
    name: "Replit",
    desc: "Full online IDE — any language, run & deploy",
    url: "https://replit.com/",
    icon: Rocket,
    color: "#f26207",
  },
  {
    name: "OneCompiler",
    desc: "Quick multi-language compiler, no signup",
    url: "https://onecompiler.com/",
    icon: Terminal,
    color: "#2dd4bf",
  },
  {
    name: "Programiz",
    desc: "Beginner-friendly C, Java, Python compiler",
    url: "https://www.programiz.com/python-programming/online-compiler/",
    icon: Cpu,
    color: "#15634f",
  },
  {
    name: "CodeSandbox",
    desc: "Web / JavaScript / React sandbox in-browser",
    url: "https://codesandbox.io/",
    icon: Boxes,
    color: "#d4a23a",
  },
];

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
// LeetCode slugs that differ from the displayed title
const SLUG = {
  "Two Sum II": "two-sum-ii-input-array-is-sorted",
  "Design Add and Search Words": "design-add-and-search-words-data-structure",
};
const lc = (name) =>
  `https://leetcode.com/problems/${SLUG[name] || slugify(name)}/`;
const lcCompany = (name) => `https://leetcode.com/company/${slugify(name)}/`;
const companyCats = [
  "All",
  ...Array.from(new Set(companies.map((c) => c.cat))),
];
const THEORY_BY_ID = Object.fromEntries(dsaTheory.map((t) => [t.id, t]));
const diffColor = (d) =>
  d === "Easy" ? "#15634f" : d === "Medium" ? "#c6692f" : "#b3402b";

const ASSESSMENTS = [
  {
    id: "dsa-sprint",
    name: "DSA Sprint",
    type: "dsa",
    count: 2,
    mins: 30,
    desc: "Two random coding problems against the clock.",
  },
  {
    id: "dsa-marathon",
    name: "DSA Marathon",
    type: "dsa",
    count: 3,
    mins: 45,
    desc: "Three problems, a longer window — endurance round.",
  },
  {
    id: "dsa-warmup",
    name: "DSA Warm-up",
    type: "dsa",
    count: 2,
    mins: 20,
    diff: "Easy",
    desc: "Two easier problems to warm up.",
  },
  {
    id: "sd-round",
    name: "System Design Round",
    type: "system",
    count: 2,
    mins: 40,
    desc: "Two open-ended system-design prompts.",
  },
  {
    id: "sd-deep",
    name: "System Design Deep Dive",
    type: "system",
    count: 3,
    mins: 60,
    desc: "Three prompts — go deep on architecture & trade-offs.",
  },
  {
    id: "mixed",
    name: "Mixed Interview",
    type: "mixed",
    count: 3,
    mins: 50,
    desc: "A blend of DSA and system-design questions.",
  },
];

export default function Prep() {
  const [view, setView] = useState("dsa");
  const tabRefs = useRef({});
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const measureTab = () => {
    const el = tabRefs.current[view];
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  };
  useLayoutEffect(() => {
    measureTab();
    const t = setTimeout(measureTab, 180);
    return () => clearTimeout(t);
  }, [view]);
  useEffect(() => {
    window.addEventListener("resize", measureTab);
    return () => window.removeEventListener("resize", measureTab);
  });
  const [diff, setDiff] = useState("All");
  const [q, setQ] = useState("");
  const [hideSolved, setHideSolved] = useState(false);
  const [randomQ, setRandomQ] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeSql, setActiveSql] = useState(null);
  const [activeSys, setActiveSys] = useState(null);
  const [sysChecks, setSysChecks] = useState({});
  const [sysNotes, setSysNotes] = useState("");
  const [codeSysIdx, setCodeSysIdx] = useState(0);
  const [codeSysChecks, setCodeSysChecks] = useState({});
  const [codeSysNotes, setCodeSysNotes] = useState("");
  const [pHint, setPHint] = useState("");
  const [pHintLoading, setPHintLoading] = useState(false);
  const [pSol, setPSol] = useState("");
  const [pSolLoading, setPSolLoading] = useState(false);
  const [pHelpErr, setPHelpErr] = useState("");
  const [solUpgrade, setSolUpgrade] = useState(false);
  const [codeLang, setCodeLang] = useState("Python");
  const [companyQ, setCompanyQ] = useState("");
  const [companyCat, setCompanyCat] = useState("All");
  const { isPro } = useAuth();
  const ivNav = useNavigate();
  const [ivRole, setIvRole] = useState("Software Engineer");
  const [ivStarted, setIvStarted] = useState(false);
  const [ivLoading, setIvLoading] = useState(false);
  const [ivQuestion, setIvQuestion] = useState("");
  const [ivFeedback, setIvFeedback] = useState("");
  const [ivAnswer, setIvAnswer] = useState("");
  const [ivHistory, setIvHistory] = useState([]);
  const [ivUpgrade, setIvUpgrade] = useState(false);
  // ---- Assessments (named, timed, random) ----
  const [asChosen, setAsChosen] = useState(null);
  const [asDone, setAsDone] = useState(false);
  const [asItems, setAsItems] = useState([]);
  const [asActive, setAsActive] = useState(0);
  const [asLeft, setAsLeft] = useState(0);
  const [asSolved, setAsSolved] = useState({});
  const [asNotes, setAsNotes] = useState({});
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const pickRandomN = (arr, n) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const buildItems = (a) => {
    const dsaNames = Object.keys(dsaProblems).filter(
      (n) => !a.diff || dsaProblems[n].difficulty === a.diff,
    );
    if (a.type === "dsa")
      return pickRandomN(dsaNames, a.count).map((name) => ({
        type: "dsa",
        name,
      }));
    if (a.type === "system")
      return pickRandomN(sysDesign, a.count).map((q) => ({
        type: "system",
        q,
      }));
    const nd = Math.ceil(a.count / 2);
    return [
      ...pickRandomN(dsaNames, nd).map((name) => ({ type: "dsa", name })),
      ...pickRandomN(sysDesign, a.count - nd).map((q) => ({
        type: "system",
        q,
      })),
    ];
  };
  const asStart = (a) => {
    setAsChosen(a);
    setAsItems(buildItems(a));
    setAsActive(0);
    setAsSolved({});
    setAsNotes({});
    setAsLeft(a.mins * 60);
    setAsDone(false);
  };
  const asFinish = () => setAsDone(true);
  const asReset = () => {
    setAsChosen(null);
    setAsDone(false);
    setAsItems([]);
    setAsSolved({});
    setAsNotes({});
    setAsLeft(0);
    setAsActive(0);
  };
  const ivErr = (e) => {
    if (e?.response?.status === 403) {
      setIvUpgrade(true);
      return;
    }
    alert(
      e?.response?.data?.error ||
        e?.response?.data?.msg ||
        "Something went wrong. Try again.",
    );
  };
  const ivStart = async () => {
    setIvLoading(true);
    setIvFeedback("");
    setIvHistory([]);
    setIvQuestion("");
    try {
      const { data } = await api.post("/ai/interview", {
        role: ivRole,
        start: true,
      });
      setIvQuestion(data.question || "Tell me about yourself.");
      setIvStarted(true);
    } catch (e) {
      ivErr(e);
    }
    setIvLoading(false);
  };
  const ivSend = async () => {
    if (!ivAnswer.trim() || ivLoading) return;
    const hist = [...ivHistory, { q: ivQuestion, a: ivAnswer }];
    setIvLoading(true);
    try {
      const { data } = await api.post("/ai/interview", {
        role: ivRole,
        history: hist,
        answer: ivAnswer,
      });
      setIvHistory(hist);
      setIvFeedback(data.feedback || "");
      setIvQuestion(data.question || "");
      setIvAnswer("");
    } catch (e) {
      ivErr(e);
    }
    setIvLoading(false);
  };
  const ivReset = () => {
    setIvStarted(false);
    setIvQuestion("");
    setIvFeedback("");
    setIvHistory([]);
    setIvAnswer("");
  };
  useEffect(() => {
    if (!asChosen || asDone) return;
    if (asLeft <= 0) {
      setAsDone(true);
      return;
    }
    const t = setTimeout(() => setAsLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [asChosen, asDone, asLeft]);
  useEffect(() => {
    setPHint("");
    setPSol("");
    setPHelpErr("");
  }, [activeProblem]);
  useEffect(() => {
    setSysChecks({});
    setSysNotes("");
  }, [activeSys]);
  useEffect(() => {
    setCodeSysChecks({});
    setCodeSysNotes("");
  }, [codeSysIdx]);
  const getHint = async () => {
    if (!activeProblem) return;
    setPHelpErr("");
    setPHintLoading(true);
    try {
      const pr = dsaProblems[activeProblem];
      const { data } = await api.post("/ai/hint", {
        title: activeProblem,
        statement: pr.statement,
      });
      setPHint(data.text || "");
    } catch (e) {
      setPHelpErr(
        e?.response?.data?.error ||
          e?.response?.data?.msg ||
          "Could not get a hint.",
      );
    }
    setPHintLoading(false);
  };
  const getSolution = async () => {
    if (!activeProblem) return;
    if (!isPro) {
      setSolUpgrade(true);
      return;
    }
    setPHelpErr("");
    setPSolLoading(true);
    try {
      const pr = dsaProblems[activeProblem];
      const { data } = await api.post("/ai/solution", {
        title: activeProblem,
        statement: pr.statement,
        difficulty: pr.difficulty,
      });
      setPSol(data.text || "");
    } catch (e) {
      if (e?.response?.status === 403) setSolUpgrade(true);
      else
        setPHelpErr(
          e?.response?.data?.error ||
            e?.response?.data?.msg ||
            "Could not load the solution.",
        );
    }
    setPSolLoading(false);
  };
  // solved problems persist across sessions
  const [solved, setSolved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("craftcv_solved")) || {};
    } catch {
      return {};
    }
  });
  // load saved progress from the account and merge it in
  useEffect(() => {
    api
      .get("/progress")
      .then(({ data }) => {
        setSolved((s) => {
          const merged = { ...s };
          (data.solved || []).forEach((name) => {
            merged[name] = true;
          });
          try {
            localStorage.setItem("craftcv_solved", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      })
      .catch(() => {});
  }, []);
  const toggleSolved = (name) =>
    setSolved((s) => {
      const willSolve = !s[name];
      const n = { ...s };
      if (n[name]) delete n[name];
      else n[name] = true;
      try {
        localStorage.setItem("craftcv_solved", JSON.stringify(n));
      } catch {}
      api
        .post("/progress/solve", { problem: name, solved: willSolve })
        .catch(() => {});
      return n;
    });
  const recordSubmission = (problem, verdict) => {
    if (!problem) return;
    api
      .post("/progress/submit", { problem, verdict, language: "python" })
      .catch(() => {});
    if (verdict === "Accepted")
      setSolved((s) => {
        if (s[problem]) return s;
        const n = { ...s, [problem]: true };
        try {
          localStorage.setItem("craftcv_solved", JSON.stringify(n));
        } catch {}
        return n;
      });
  };

  const totalProblems = useMemo(
    () => dsaTopics.reduce((n, t) => n + t.problems.length, 0),
    [],
  );
  const solvedCount = useMemo(
    () =>
      dsaTopics.flatMap((t) => t.problems).filter(([p]) => solved[p]).length,
    [solved],
  );
  const allBehavioral = useMemo(() => behavioral.flatMap((b) => b.qs), []);
  const pickRandom = () =>
    setRandomQ(allBehavioral[Math.floor(Math.random() * allBehavioral.length)]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActiveTopic(null);
        setActiveProblem(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredTopics = useMemo(() => {
    const query = q.trim().toLowerCase();
    return dsaTopics
      .map((t) => ({
        ...t,
        problems: t.problems.filter(
          ([p, d]) =>
            (diff === "All" || d === diff) &&
            p.toLowerCase().includes(query) &&
            (!hideSolved || !solved[p]),
        ),
      }))
      .filter((t) => t.problems.length > 0);
  }, [diff, q, hideSolved, solved]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">
            Interview Studio
          </h1>
          <p className="text-ink2 mt-1.5 max-w-2xl">
            Master DSA patterns across every level, rehearse behavioral answers,
            learn system design, practice SQL, and jump into a professional
            compiler — everything in one place.
          </p>
        </div>

        {/* menu — underline tabs */}
        <div className="mb-8 border-b border-line overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative flex gap-0.5 min-w-max sm:min-w-full">
            {[
              ["dsa", "DSA Topics", Brain],
              ["theory", "DSA Course", GraduationCap],
              ["interview", "Mock Interview", Mic],
              ["assessment", "Assessments", Timer],
              ["behavioral", "Behavioral", MessageSquare],
              ["system", "System Design", Network],
              ["code", "Code Practice", Code2],
              ["sql", "SQL", Database],
              ["companies", "Companies", Building2],
            ].map(([k, l, Icon]) => {
              const active = view === k;
              return (
                <button
                  key={k}
                  ref={(el) => {
                    if (el) tabRefs.current[k] = el;
                  }}
                  onClick={() => setView(k)}
                  className={`relative flex sm:flex-1 items-center justify-center gap-2 px-3.5 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 ${active ? "text-ink" : "text-ink2 hover:text-ink"}`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span>{l}</span>
                </button>
              );
            })}
            <span
              className="absolute -bottom-px h-0.5 rounded-full bg-brand transition-all duration-300 ease-out"
              style={{ left: ind.left, width: ind.width }}
            />
          </div>
        </div>

        <div key={view} style={{ animation: "secUp .28s ease both" }}>
          {/* ---- DSA ---- */}
          {view === "dsa" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 w-full">
                <div className="relative flex-1">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
                  />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={`Search ${totalProblems} problems…`}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition"
                  />
                </div>
                <div className="flex gap-1.5">
                  {["All", "Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiff(d)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${diff === d ? "text-white border-transparent" : "bg-card text-ink2 border-line hover:bg-paper"}`}
                      style={
                        diff === d
                          ? {
                              background:
                                d === "All" ? "#1b1a17" : diffColor(d),
                            }
                          : undefined
                      }
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => setHideSolved((v) => !v)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${hideSolved ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}
                  >
                    {hideSolved ? "Solved hidden" : "Hide solved"}
                  </button>
                </div>
              </div>

              {/* progress tracker */}
              <div className="w-full mb-6">
                <div className="flex items-center justify-between text-xs text-ink2 mb-1.5">
                  <span className="font-semibold">Your progress</span>
                  <span className="font-semibold text-ink">
                    {solvedCount} / {totalProblems} solved ·{" "}
                    {Math.round((solvedCount / totalProblems) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(solvedCount / totalProblems) * 100}%`,
                      background: "linear-gradient(90deg,#18a884,#2dd4bf)",
                      transition: "width .6s cubic-bezier(.22,1,.36,1)",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 gap-4">
                {filteredTopics.map((t, idx) => {
                  const tSolved = t.problems.filter(([p]) => solved[p]).length;
                  const pct = t.problems.length
                    ? Math.round((tSolved / t.problems.length) * 100)
                    : 0;
                  return (
                    <div
                      key={t.name}
                      className="rounded-2xl border border-line bg-card p-5 flex flex-col hover:border-brand/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className="grid place-items-center w-9 h-9 rounded-xl text-white font-bold text-sm shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg,#18a884,#0f8163)",
                          }}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display text-base font-semibold leading-tight truncate">
                              {t.name}
                            </h3>
                            <span className="text-[11px] font-semibold text-ink2 shrink-0">
                              {tSolved}/{t.problems.length}
                            </span>
                          </div>
                          <p className="text-xs text-ink2 leading-snug mt-0.5 truncate">
                            {t.patterns}
                          </p>
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-line overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg,#18a884,#2dd4bf)",
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {t.problems.map(([p, d]) => {
                          const isSolved = solved[p];
                          const solvable = !!dsaProblems[p];
                          return (
                            <div
                              key={p}
                              className="group flex items-center gap-2.5 pl-2 pr-2.5 py-2 rounded-lg hover:bg-paper transition"
                            >
                              <button
                                onClick={() => toggleSolved(p)}
                                title={
                                  isSolved
                                    ? "Solved — click to undo"
                                    : "Mark as solved"
                                }
                                className="shrink-0 grid place-items-center w-5 h-5 rounded-full border transition"
                                style={{
                                  borderColor: isSolved
                                    ? "#18a884"
                                    : "var(--color-line)",
                                  background: isSolved
                                    ? "#18a884"
                                    : "transparent",
                                }}
                              >
                                {isSolved && (
                                  <Check size={12} className="text-white" />
                                )}
                              </button>
                              {solvable ? (
                                <button
                                  onClick={() => setActiveProblem(p)}
                                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                                >
                                  <span
                                    className={`text-sm truncate ${isSolved ? "line-through text-ink2" : "text-ink"}`}
                                  >
                                    {p}
                                  </span>
                                  <span className="ml-auto shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand text-white tracking-wide">
                                    SOLVE
                                  </span>
                                  <span
                                    className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                    style={{
                                      color: diffColor(d),
                                      background: diffColor(d) + "1a",
                                    }}
                                  >
                                    {d}
                                  </span>
                                </button>
                              ) : (
                                <a
                                  href={lc(p)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 flex-1 min-w-0"
                                >
                                  <span
                                    className={`text-sm truncate ${isSolved ? "line-through text-ink2" : "text-ink"}`}
                                  >
                                    {p}
                                  </span>
                                  <span
                                    className="ml-auto shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                    style={{
                                      color: diffColor(d),
                                      background: diffColor(d) + "1a",
                                    }}
                                  >
                                    {d}
                                  </span>
                                  <ExternalLink
                                    size={13}
                                    className="shrink-0 text-ink2 group-hover:text-brand transition"
                                  />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredTopics.length === 0 && (
                <p className="text-ink2 text-center py-16">
                  No problems match your search.
                </p>
              )}
            </>
          )}

          {/* ---- Behavioral ---- */}
          {view === "theory" && (
            <div className="w-full">
              <p className="text-ink2 text-sm mb-4 text-center">
                A complete DSA course — {dsaCourse.length} modules from
                programming basics to advanced & competitive topics. Open any
                module for class-by-class detail, with multi-language code where
                it applies.
              </p>
              <div className="rounded-2xl border border-line bg-card p-4 mb-6">
                <div className="text-xs font-semibold text-ink2 mb-2">
                  Recommended learning order
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {learningOrder.map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-paper border border-line text-xs font-semibold"
                    >
                      <span className="grid place-items-center w-4 h-4 rounded-full bg-brand text-white text-[9px]">
                        {i + 1}
                      </span>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dsaCourse.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTopic(m);
                      setCodeLang("Python");
                    }}
                    className="group text-left rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand font-bold shrink-0">
                        {m.num}
                      </span>
                      <h3 className="font-display text-lg font-semibold leading-tight">
                        {m.title}
                      </h3>
                    </div>
                    <p className="text-sm text-ink2 leading-snug">
                      {m.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand mt-3 group-hover:gap-2 transition-all">
                      {m.classes.length} classes <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "interview" && (
            <div className="w-full">
              {!isPro ? (
                <div className="rounded-2xl border border-line bg-card p-8 sm:p-10 text-center">
                  <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4">
                    <Crown className="text-brand" size={26} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">
                    AI Mock Interview{" "}
                    <span className="text-xs font-bold bg-brand text-white px-2 py-0.5 rounded-full align-middle">
                      PRO
                    </span>
                  </h3>
                  <p className="text-ink2 max-w-md mx-auto mb-6">
                    Practice with an AI interviewer that asks role-specific
                    questions, reacts to your answers, and gives instant
                    feedback — as many rounds as you want.
                  </p>
                  <button
                    onClick={() => ivNav("/pricing")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
                  >
                    <Crown size={18} /> Upgrade to Pro
                  </button>
                </div>
              ) : !ivStarted ? (
                <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand/10">
                      <Mic className="text-brand" size={22} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        AI Mock Interview
                      </h3>
                      <p className="text-sm text-ink2">
                        Pick a role and start practising.
                      </p>
                    </div>
                  </div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Role / position
                  </label>
                  <input
                    value={ivRole}
                    onChange={(e) => setIvRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full rounded-xl border border-line bg-paper/50 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand transition mb-4"
                  />
                  <button
                    onClick={ivStart}
                    disabled={ivLoading}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 hover:bg-brand-dark transition"
                  >
                    {ivLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" /> Starting…
                      </>
                    ) : (
                      <>
                        <Mic size={17} /> Start interview
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-ink2">
                      Mock interview · {ivRole}
                    </span>
                    <button
                      onClick={ivReset}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink2 hover:text-rust transition"
                    >
                      <RotateCcw size={14} /> Restart
                    </button>
                  </div>

                  {ivHistory.length > 0 && (
                    <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-auto pr-1">
                      {ivHistory.map((h, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="text-sm">
                            <span className="font-semibold text-brand">
                              Q{i + 1}.{" "}
                            </span>
                            {h.q}
                          </div>
                          <div className="text-sm text-ink2 pl-4 border-l-2 border-line">
                            {h.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {ivFeedback && (
                    <div className="rounded-xl bg-brand/5 border border-brand/20 px-4 py-3 mb-4 text-sm">
                      <span className="font-semibold text-brand">
                        Feedback:{" "}
                      </span>
                      <span className="text-ink">{ivFeedback}</span>
                    </div>
                  )}

                  <div className="rounded-xl border border-line bg-paper/40 px-4 py-3 mb-3">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-ink2 mb-1">
                      Question {ivHistory.length + 1}
                    </div>
                    <div className="text-[15px] font-medium text-ink">
                      {ivLoading && !ivQuestion ? "…" : ivQuestion}
                    </div>
                  </div>

                  <textarea
                    value={ivAnswer}
                    onChange={(e) => setIvAnswer(e.target.value)}
                    rows={4}
                    placeholder="Type your answer…"
                    className="w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition resize-y"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={ivSend}
                      disabled={ivLoading || !ivAnswer.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 hover:bg-brand-dark transition"
                    >
                      {ivLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Thinking…
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === "assessment" && (
            <div className="w-full">
              {!asChosen ? (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand/10">
                      <Timer className="text-brand" size={22} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        Assessments
                      </h3>
                      <p className="text-sm text-ink2">
                        Pick a timed assessment — you get fresh random questions
                        each attempt.
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ASSESSMENTS.map((a) => {
                      const col =
                        a.type === "system"
                          ? "#d4a23a"
                          : a.type === "mixed"
                            ? "#7c3aed"
                            : "#18a884";
                      const tag =
                        a.type === "system"
                          ? "System Design"
                          : a.type === "mixed"
                            ? "Mixed"
                            : "DSA";
                      return (
                        <div
                          key={a.id}
                          className="rounded-2xl border border-line bg-card p-5 flex flex-col"
                        >
                          <span
                            className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ color: col, background: col + "1a" }}
                          >
                            {tag}
                          </span>
                          <h4 className="font-display text-lg font-semibold">
                            {a.name}
                          </h4>
                          <p className="text-sm text-ink2 mt-1 mb-3 flex-1">
                            {a.desc}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-ink2 mb-3">
                            <span className="inline-flex items-center gap-1">
                              <Layers size={13} /> {a.count} questions
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Timer size={13} /> {a.mins} min
                            </span>
                          </div>
                          <button
                            onClick={() => asStart(a)}
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
                          >
                            Start <ChevronRight size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : asDone ? (
                <div className="rounded-2xl border border-line bg-card p-6 sm:p-8 text-center">
                  <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4">
                    <Trophy className="text-brand" size={26} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-1">
                    {asChosen.name} complete
                  </h3>
                  <p className="text-ink2 mb-5">
                    Marked {Object.values(asSolved).filter(Boolean).length} of{" "}
                    {asItems.length} done · time used{" "}
                    {fmt(Math.max(0, asChosen.mins * 60 - asLeft))}
                  </p>
                  <div className="flex flex-col gap-2 max-w-md mx-auto mb-6 text-left">
                    {asItems.map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 rounded-lg border border-line bg-paper/40 px-4 py-2.5"
                      >
                        <span className="text-sm font-medium truncate">
                          {it.type === "dsa" ? it.name : it.q.title}
                        </span>
                        <span
                          className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${asSolved[i] ? "text-brand bg-brand/10" : "text-ink2 bg-card"}`}
                        >
                          {asSolved[i] ? "Done" : "Skipped"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={asReset}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
                  >
                    <RotateCcw size={17} /> Back to assessments
                  </button>
                </div>
              ) : (
                (() => {
                  const item = asItems[asActive];
                  const low = asLeft <= 60;
                  return (
                    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                        <span className="text-sm font-semibold text-ink2">
                          {asChosen.name}
                        </span>
                        <button
                          onClick={asReset}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-ink2 hover:text-rust transition"
                        >
                          <RotateCcw size={13} /> Exit
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-lg"
                          style={{
                            fontFamily: "ui-monospace, Menlo, monospace",
                            background: low
                              ? "rgba(224,116,58,.12)"
                              : "rgba(255,255,255,.05)",
                            color: low ? "#e0743a" : "var(--color-ink)",
                          }}
                        >
                          <Timer size={18} /> {fmt(asLeft)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {asItems.map((it, i) => (
                            <button
                              key={i}
                              onClick={() => setAsActive(i)}
                              className={`w-8 h-8 rounded-lg text-sm font-bold transition ${i === asActive ? "bg-brand text-white" : asSolved[i] ? "bg-brand/15 text-brand" : "bg-paper/40 text-ink2 border border-line"}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={asFinish}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line bg-paper/40 text-sm font-semibold text-ink2 hover:text-rust transition"
                        >
                          Finish
                        </button>
                      </div>

                      {item.type === "dsa" ? (
                        (() => {
                          const pr = dsaProblems[item.name];
                          return (
                            <>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <h3 className="font-display text-lg font-semibold">
                                  {item.name}
                                </h3>
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    color: diffColor(pr.difficulty),
                                    background: diffColor(pr.difficulty) + "1a",
                                  }}
                                >
                                  {pr.difficulty}
                                </span>
                              </div>
                              <p className="text-sm leading-6 text-ink mb-3">
                                {pr.statement}
                              </p>
                              <div className="flex flex-col gap-2 mb-3">
                                {pr.examples.slice(0, 2).map((ex, i) => (
                                  <div
                                    key={i}
                                    className="rounded-lg border border-line bg-paper/40 px-3 py-2 text-[13px]"
                                    style={{
                                      fontFamily:
                                        "ui-monospace, Menlo, monospace",
                                    }}
                                  >
                                    <div>
                                      <span className="text-ink2">In: </span>
                                      {ex.input}
                                    </div>
                                    <div>
                                      <span className="text-ink2">Out: </span>
                                      {ex.output}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <CodeRunner
                                key={"dsa" + asActive}
                                initialLangKey="python"
                                initialCode={pr.starter}
                                tests={pr.tests}
                                funcName={pr.func}
                              />
                            </>
                          );
                        })()
                      ) : (
                        <>
                          <h3 className="font-display text-lg font-semibold mb-1">
                            {item.q.title}
                          </h3>
                          <p className="text-sm leading-6 text-ink mb-3">
                            {item.q.prompt}
                          </p>
                          {item.q.points && item.q.points.length > 0 && (
                            <div className="rounded-xl border border-line bg-paper/40 px-4 py-3 mb-3">
                              <div className="text-[11px] font-bold uppercase tracking-wide text-ink2 mb-1.5">
                                Make sure you cover
                              </div>
                              <ul className="flex flex-col gap-1.5">
                                {item.q.points.map((pt, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-2 text-sm text-ink2"
                                  >
                                    <span className="text-brand">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <textarea
                            rows={8}
                            value={asNotes[asActive] || ""}
                            onChange={(e) =>
                              setAsNotes((m) => ({
                                ...m,
                                [asActive]: e.target.value,
                              }))
                            }
                            placeholder="Sketch your design: core components, data model, APIs, scaling, bottlenecks & trade-offs…"
                            className="w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition resize-y"
                          />
                        </>
                      )}

                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() =>
                            setAsSolved((m) => ({
                              ...m,
                              [asActive]: !m[asActive],
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${asSolved[asActive] ? "bg-brand text-white" : "border border-line text-ink2 hover:text-ink"}`}
                        >
                          <Check size={15} />{" "}
                          {asSolved[asActive] ? "Marked done" : "Mark done"}
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {view === "behavioral" && (
            <>
              <div className="w-full mb-5 flex items-center gap-3 flex-wrap">
                <button
                  onClick={pickRandom}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark hover:-translate-y-0.5 transition-all shrink-0"
                >
                  <Shuffle size={15} /> Random question
                </button>
                {randomQ ? (
                  <div className="flex-1 min-w-[200px] rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-medium">
                    {randomQ}
                  </div>
                ) : (
                  <span className="text-sm text-ink2">
                    Tap for a surprise prompt to rehearse out loud.
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {behavioral.map((b) => (
                  <div
                    key={b.cat}
                    className="rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare size={17} className="text-brand" /> {b.cat}
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {b.qs.map((qq, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 items-start text-sm leading-relaxed"
                        >
                          <span className="shrink-0 grid place-items-center w-5 h-5 rounded bg-rust/10 text-rust font-bold text-[11px] mt-0.5">
                            {i + 1}
                          </span>
                          {qq}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-brand/10 px-5 py-4 text-sm text-brand-dark leading-relaxed mt-4 w-full">
                <strong>Tip — answer with STAR:</strong> Situation, Task,
                Action, Result. Keep each story under 2 minutes and finish with
                a measurable result.
              </div>
            </>
          )}

          {/* ---- System Design ---- */}
          {view === "system" && (
            <div className="w-full">
              <h2 className="font-display text-xl font-semibold mb-1">
                Core concepts
              </h2>
              <p className="text-ink2 text-sm mb-4">
                The building blocks interviewers expect you to reason about.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-9">
                {sysConcepts.map(([name, desc, Icon]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-line bg-card p-5"
                  >
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 mb-3">
                      <Icon size={20} className="text-brand" />
                    </span>
                    <h3 className="font-semibold mb-1">{name}</h3>
                    <p className="text-xs text-ink2 leading-snug">{desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                Practice ({sysDesign.length} questions)
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Pick a question, tick off the points as you cover them, and
                sketch your design.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-9">
                {sysDesign.map((qq, i) => (
                  <button
                    key={qq.title}
                    onClick={() => setActiveSys(qq)}
                    className="text-left rounded-2xl border border-line bg-card p-5 hover:border-brand transition flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand/10 text-brand font-bold text-sm shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold leading-tight">
                        {qq.title}
                      </h3>
                    </div>
                    <p className="text-xs text-ink2 leading-snug pl-9">
                      {(qq.points || []).length} key points to cover
                    </p>
                  </button>
                ))}
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                More to try
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Walk through requirements → high-level design → deep dive →
                trade-offs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sysQuestions.map(([title, hint], i) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-line bg-card p-5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-rust/10 text-rust font-bold text-sm shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold leading-tight">{title}</h3>
                    </div>
                    <p className="text-xs text-ink2 leading-snug pl-9">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="https://github.com/donnemartin/system-design-primer"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-brand hover:underline"
              >
                <BookOpen size={16} /> Deep-dive with the System Design Primer{" "}
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* ---- Code Practice ---- */}
          {view === "code" && (
            <div className="w-full">
              <h2 className="font-display text-xl font-semibold mb-1">
                Run code right here
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Write, highlight and run code in 7 languages with full syntax
                colors. JS & Python run in your browser; C, C++, Go, Java & C#
                compile online — no key needed.
              </p>
              <div className="mb-9">
                <CodeRunner />
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                System design workspace
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Pick a prompt and design it right here — tick the points as you
                cover them and write your approach.
              </p>
              <div className="rounded-2xl border border-line bg-card p-5 mb-9">
                <select
                  value={codeSysIdx}
                  onChange={(e) => setCodeSysIdx(Number(e.target.value))}
                  className="w-full mb-4 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
                >
                  {sysDesign.map((qq, i) => (
                    <option key={qq.title} value={i}>
                      {qq.title}
                    </option>
                  ))}
                </select>
                {(() => {
                  const qq = sysDesign[codeSysIdx];
                  const pts = qq.points || [];
                  const done = pts.filter((_, i) => codeSysChecks[i]).length;
                  return (
                    <>
                      <p className="text-[15px] leading-7 text-ink mb-4">
                        {qq.prompt}
                      </p>
                      {pts.length > 0 && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">
                              Cover these points
                            </span>
                            <span className="text-xs font-semibold text-ink2">
                              {done} / {pts.length}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-line overflow-hidden mb-4">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(done / pts.length) * 100}%`,
                                background:
                                  "linear-gradient(90deg,#18a884,#2dd4bf)",
                                transition: "width .4s ease",
                              }}
                            />
                          </div>
                          <ul className="flex flex-col gap-2 mb-5">
                            {pts.map((pt, i) => (
                              <li key={i}>
                                <button
                                  onClick={() =>
                                    setCodeSysChecks((m) => ({
                                      ...m,
                                      [i]: !m[i],
                                    }))
                                  }
                                  className="w-full flex items-start gap-2.5 text-left text-sm"
                                >
                                  <span
                                    className="shrink-0 mt-0.5 grid place-items-center w-5 h-5 rounded-md border transition"
                                    style={{
                                      borderColor: codeSysChecks[i]
                                        ? "#18a884"
                                        : "var(--color-line)",
                                      background: codeSysChecks[i]
                                        ? "#18a884"
                                        : "transparent",
                                    }}
                                  >
                                    {codeSysChecks[i] && (
                                      <Check size={12} className="text-white" />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      codeSysChecks[i]
                                        ? "text-ink2 line-through"
                                        : "text-ink"
                                    }
                                  >
                                    {pt}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <textarea
                        rows={8}
                        value={codeSysNotes}
                        onChange={(e) => setCodeSysNotes(e.target.value)}
                        placeholder="Design here: core components, data model, APIs, scaling, bottlenecks & trade-offs…"
                        className="w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition resize-y"
                      />
                    </>
                  );
                })()}
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                Online judges & contests
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Practice with test cases and contests across skill levels — each
                opens in a new tab.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
                {judges.map((c) => (
                  <a
                    key={c.name}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <span
                      className="grid place-items-center w-12 h-12 rounded-xl shrink-0"
                      style={{ background: c.color + "1a" }}
                    >
                      <c.icon size={24} style={{ color: c.color }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-display text-lg font-semibold">
                        {c.name}{" "}
                        <ExternalLink
                          size={15}
                          className="text-ink2 group-hover:text-brand transition"
                        />
                      </div>
                      <div className="text-sm text-ink2 leading-snug">
                        {c.desc}
                      </div>
                      <span className="inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                        {c.level}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                IDEs & sandboxes
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Write and run code in any language right in the browser.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9">
                {ides.map((c) => (
                  <a
                    key={c.name}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <span
                      className="grid place-items-center w-12 h-12 rounded-xl shrink-0"
                      style={{ background: c.color + "1a" }}
                    >
                      <c.icon size={24} style={{ color: c.color }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-display text-lg font-semibold">
                        {c.name}{" "}
                        <ExternalLink
                          size={15}
                          className="text-ink2 group-hover:text-brand transition"
                        />
                      </div>
                      <div className="text-sm text-ink2 leading-snug">
                        {c.desc}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <h2 className="font-display text-xl font-semibold mb-1">
                Quick-start problems
              </h2>
              <p className="text-ink2 text-sm mb-4">
                Warm up with these — each opens on LeetCode.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {dsaTopics
                  .flatMap((t) => t.problems)
                  .slice(0, 12)
                  .map(([p, d]) => (
                    <a
                      key={p}
                      href={lc(p)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-line bg-card hover:border-brand transition group"
                    >
                      <span className="text-sm font-medium truncate">{p}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: diffColor(d),
                            background: diffColor(d) + "1a",
                          }}
                        >
                          {d}
                        </span>
                        <ExternalLink
                          size={14}
                          className="text-ink2 group-hover:text-brand transition"
                        />
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          )}

          {view === "companies" && (
            <div className="w-full">
              <p className="text-ink2 text-sm mb-5 text-center">
                {companies.length}+ product-based companies known for DSA-heavy
                interviews — each opens its LeetCode company-tagged problems
                (some need LeetCode Premium).
              </p>
              <div className="relative max-w-md mx-auto mb-4">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
                />
                <input
                  value={companyQ}
                  onChange={(e) => setCompanyQ(e.target.value)}
                  placeholder={`Search ${companies.length} companies…`}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap justify-center mb-6">
                {companyCats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCompanyCat(cat)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${companyCat === cat ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {(() => {
                const query = companyQ.trim().toLowerCase();
                const list = companies.filter(
                  (c) =>
                    (companyCat === "All" || c.cat === companyCat) &&
                    c.name.toLowerCase().includes(query),
                );
                if (list.length === 0)
                  return (
                    <p className="text-ink2 text-center py-16">
                      No companies match your search.
                    </p>
                  );
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {list.map((c) => (
                      <a
                        key={c.name}
                        href={lcCompany(c.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="group rounded-2xl border border-line bg-card p-4 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand/10 text-brand font-bold text-sm shrink-0">
                            {c.name[0]}
                          </span>
                          <ExternalLink
                            size={14}
                            className="text-ink2 group-hover:text-brand transition shrink-0 mt-1"
                          />
                        </div>
                        <div className="font-semibold text-sm leading-tight">
                          {c.name}
                        </div>
                        <span className="text-[10px] font-semibold text-ink2">
                          {c.cat}
                        </span>
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* full-screen course modal */}
          {activeTopic && (
            <div
              className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-6"
              style={{ background: "rgba(0,0,0,.65)" }}
              onClick={() => setActiveTopic(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-card border border-line w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]"
                style={{ animation: "secUp .25s ease both" }}
              >
                <div className="flex items-center justify-between gap-3 p-5 border-b border-line shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand font-bold shrink-0">
                      {activeTopic.num}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-semibold truncate">
                        {activeTopic.title}
                      </h2>
                      <p className="text-xs text-ink2 truncate">
                        {activeTopic.summary}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTopic(null)}
                    aria-label="Close"
                    className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto p-5 sm:p-6">
                  {activeTopic.classes.map((cls, ci) => (
                    <div key={ci} className="mb-7">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand shrink-0">
                          Class {ci + 1}
                        </span>
                        <h4 className="font-display text-lg font-semibold">
                          {cls.title}
                        </h4>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {cls.topics.map(([name, detail], ti) => (
                          <div
                            key={ti}
                            className="rounded-xl border border-line bg-paper px-4 py-3"
                          >
                            <div className="text-[15px] font-semibold mb-2 text-ink">
                              {name}
                            </div>
                            <ul className="flex flex-col gap-2">
                              {detail
                                .split(/(?<=\.)\s+(?=[A-Z])/)
                                .map((line, li) => (
                                  <li
                                    key={li}
                                    className="flex gap-2.5 text-sm leading-6"
                                    style={{ color: "#cdd3de" }}
                                  >
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

                  {activeTopic.codeId &&
                    THEORY_BY_ID[activeTopic.codeId]?.examples && (
                      <div className="mb-1">
                        <h4 className="font-semibold text-sm mb-2">
                          Code example
                        </h4>
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          {THEORY_BY_ID[activeTopic.codeId].examples.map(
                            (ex) => (
                              <button
                                key={ex.lang}
                                onClick={() => setCodeLang(ex.lang)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${codeLang === ex.lang ? "bg-brand text-white border-brand" : "bg-card text-ink2 border-line hover:bg-paper"}`}
                              >
                                {ex.lang}
                              </button>
                            ),
                          )}
                        </div>
                        <pre
                          className="rounded-xl p-4 overflow-x-auto text-[12.5px] leading-relaxed"
                          style={{
                            background: "#0d1117",
                            color: "#e6edf3",
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          <code>
                            {
                              (
                                THEORY_BY_ID[activeTopic.codeId].examples.find(
                                  (e) => e.lang === codeLang,
                                ) ||
                                THEORY_BY_ID[activeTopic.codeId].examples[0]
                              ).code
                            }
                          </code>
                        </pre>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
          {view === "sql" && (
            <div className="w-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand/10">
                  <Database className="text-brand" size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    SQL Practice
                  </h3>
                  <p className="text-sm text-ink2">
                    Write real queries against a live in-browser database,
                    judged like LeetCode. {sqlProblems.length} problems.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sqlProblems.map((pb) => (
                  <button
                    key={pb.id}
                    onClick={() => setActiveSql(pb)}
                    className="text-left rounded-2xl border border-line bg-card p-5 hover:border-brand transition flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-display text-base font-semibold">
                        {pb.title}
                      </h4>
                      <span
                        className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: diffColor(pb.difficulty),
                          background: diffColor(pb.difficulty) + "1a",
                        }}
                      >
                        {pb.difficulty}
                      </span>
                    </div>
                    <span className="text-xs text-ink2">{pb.topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeSys && (
        <div
          className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-6"
          style={{ background: "rgba(0,0,0,.65)" }}
          onClick={() => setActiveSys(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card border border-line w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]"
            style={{ animation: "secUp .25s ease both" }}
          >
            <div className="flex items-center justify-between gap-3 p-5 border-b border-line shrink-0">
              <h2 className="font-display text-xl font-semibold truncate">
                {activeSys.title}
              </h2>
              <button
                onClick={() => setActiveSys(null)}
                aria-label="Close"
                className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink shrink-0"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-5 sm:p-6">
              <p className="text-[15px] leading-7 text-ink mb-5">
                {activeSys.prompt}
              </p>
              {(activeSys.points || []).length > 0 &&
                (() => {
                  const done = activeSys.points.filter(
                    (_, i) => sysChecks[i],
                  ).length;
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display text-base font-semibold">
                          Cover these points
                        </h4>
                        <span className="text-xs font-semibold text-ink2">
                          {done} / {activeSys.points.length}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-line overflow-hidden mb-4">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(done / activeSys.points.length) * 100}%`,
                            background:
                              "linear-gradient(90deg,#18a884,#2dd4bf)",
                            transition: "width .4s ease",
                          }}
                        />
                      </div>
                      <ul className="flex flex-col gap-2 mb-6">
                        {activeSys.points.map((pt, i) => (
                          <li key={i}>
                            <button
                              onClick={() =>
                                setSysChecks((m) => ({ ...m, [i]: !m[i] }))
                              }
                              className="w-full flex items-start gap-2.5 text-left text-sm"
                            >
                              <span
                                className="shrink-0 mt-0.5 grid place-items-center w-5 h-5 rounded-md border transition"
                                style={{
                                  borderColor: sysChecks[i]
                                    ? "#18a884"
                                    : "var(--color-line)",
                                  background: sysChecks[i]
                                    ? "#18a884"
                                    : "transparent",
                                }}
                              >
                                {sysChecks[i] && (
                                  <Check size={12} className="text-white" />
                                )}
                              </span>
                              <span
                                className={
                                  sysChecks[i]
                                    ? "text-ink2 line-through"
                                    : "text-ink"
                                }
                              >
                                {pt}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              <h4 className="font-display text-base font-semibold mb-2">
                Your design
              </h4>
              <textarea
                rows={8}
                value={sysNotes}
                onChange={(e) => setSysNotes(e.target.value)}
                placeholder="Sketch your design: core components, data model, APIs, scaling, bottlenecks & trade-offs…"
                className="w-full rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand transition resize-y"
              />
            </div>
          </div>
        </div>
      )}

      {activeSql && (
        <div
          className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-6"
          style={{ background: "rgba(0,0,0,.65)" }}
          onClick={() => setActiveSql(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card border border-line w-full sm:max-w-3xl sm:rounded-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]"
            style={{ animation: "secUp .25s ease both" }}
          >
            <div className="flex items-center justify-between gap-3 p-5 border-b border-line shrink-0">
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold truncate">
                  {activeSql.title}
                </h2>
                <p className="text-xs text-ink2 truncate">{activeSql.topic}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: diffColor(activeSql.difficulty),
                    background: diffColor(activeSql.difficulty) + "1a",
                  }}
                >
                  {activeSql.difficulty}
                </span>
                <button
                  onClick={() => setActiveSql(null)}
                  aria-label="Close"
                  className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 sm:p-6">
              <p className="text-[15px] leading-7 text-ink mb-4">
                {activeSql.prompt}
              </p>
              <details className="mb-5 rounded-xl border border-line bg-paper px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-brand select-none">
                  View tables &amp; sample data
                </summary>
                <pre
                  className="mt-3 text-[12px] text-ink2 whitespace-pre-wrap leading-relaxed"
                  style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                >
                  {activeSql.schema}
                </pre>
              </details>
              <SqlRunner
                schema={activeSql.schema}
                expected={activeSql.expected}
                ordered={!!activeSql.ordered}
              />
            </div>
          </div>
        </div>
      )}

      {activeProblem &&
        dsaProblems[activeProblem] &&
        (() => {
          const pr = dsaProblems[activeProblem];
          return (
            <div
              className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-6"
              style={{ background: "rgba(0,0,0,.65)" }}
              onClick={() => setActiveProblem(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-card border border-line w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]"
                style={{ animation: "secUp .25s ease both" }}
              >
                <div className="flex items-center justify-between gap-3 p-5 border-b border-line shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleSolved(activeProblem)}
                      title={
                        solved[activeProblem]
                          ? "Solved — click to undo"
                          : "Mark as solved"
                      }
                      className="shrink-0 grid place-items-center w-7 h-7 rounded-full border transition"
                      style={{
                        borderColor: solved[activeProblem]
                          ? "#18a884"
                          : "var(--color-line)",
                        background: solved[activeProblem]
                          ? "#18a884"
                          : "transparent",
                      }}
                    >
                      {solved[activeProblem] && (
                        <Check size={14} className="text-white" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-semibold truncate">
                        {activeProblem}
                      </h2>
                      <p className="text-xs text-ink2 truncate">{pr.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: diffColor(pr.difficulty),
                        background: diffColor(pr.difficulty) + "1a",
                      }}
                    >
                      {pr.difficulty}
                    </span>
                    <button
                      onClick={() => setActiveProblem(null)}
                      aria-label="Close"
                      className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto p-5 sm:p-6">
                  <p className="text-[15px] leading-7 text-ink mb-5">
                    {pr.statement}
                  </p>

                  <h4 className="font-display text-base font-semibold mb-2">
                    Examples
                  </h4>
                  <div className="flex flex-col gap-2.5 mb-5">
                    {pr.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-line bg-paper px-4 py-3 text-sm"
                      >
                        <div
                          style={{
                            fontFamily: "ui-monospace, Menlo, monospace",
                          }}
                          className="text-[13px]"
                        >
                          <span className="text-ink2">Input: </span>
                          {ex.input}
                        </div>
                        <div
                          style={{
                            fontFamily: "ui-monospace, Menlo, monospace",
                          }}
                          className="text-[13px] mt-1"
                        >
                          <span className="text-ink2">Output: </span>
                          {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="text-ink2 mt-1.5 leading-6">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {pr.constraints?.length > 0 && (
                    <>
                      <h4 className="font-display text-base font-semibold mb-2">
                        Constraints
                      </h4>
                      <ul className="flex flex-col gap-1.5 mb-5">
                        {pr.constraints.map((c, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 text-sm text-ink2"
                          >
                            <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-brand" />
                            <span
                              style={{
                                fontFamily: "ui-monospace, Menlo, monospace",
                              }}
                              className="text-[13px]"
                            >
                              {c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {pr.hints?.length > 0 && (
                    <details className="mb-6 rounded-xl border border-line bg-paper px-4 py-3">
                      <summary className="cursor-pointer text-sm font-semibold text-brand select-none">
                        Show hints ({pr.hints.length})
                      </summary>
                      <ul className="flex flex-col gap-2 mt-3">
                        {pr.hints.map((h, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 text-sm leading-6"
                            style={{ color: "#cdd3de" }}
                          >
                            <span className="shrink-0 font-bold text-brand">
                              {i + 1}.
                            </span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* AI help — hint (free) + solution (Pro) */}
                  <div className="rounded-xl border border-line bg-paper px-4 py-3 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold mr-1">Stuck?</span>
                      <button
                        onClick={getHint}
                        disabled={pHintLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-sm font-semibold text-ink2 hover:text-ink transition disabled:opacity-60"
                      >
                        {pHintLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Lightbulb size={14} />
                        )}{" "}
                        Get a hint
                      </button>
                      <button
                        onClick={getSolution}
                        disabled={pSolLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-60"
                      >
                        {pSolLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Crown size={14} />
                        )}{" "}
                        Show solution
                      </button>
                    </div>
                    {pHelpErr && (
                      <p className="text-sm text-rust mt-2">{pHelpErr}</p>
                    )}
                    {pHint && (
                      <div
                        className="mt-3 text-sm leading-6 rounded-lg bg-brand/5 border border-brand/20 px-3 py-2.5"
                        style={{ color: "#cdd3de" }}
                      >
                        <span className="font-semibold text-brand">Hint: </span>
                        {pHint}
                      </div>
                    )}
                    {pSol && (
                      <div className="mt-3 rounded-lg border border-line bg-card overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-line">
                          <span className="text-xs font-bold uppercase tracking-wide text-ink2">
                            Editorial
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(pSol)}
                            className="text-xs font-semibold text-brand hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                        <pre
                          className="px-3 py-3 text-[13px] text-ink whitespace-pre-wrap leading-relaxed"
                          style={{ fontFamily: "inherit" }}
                        >
                          {pSol}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="font-display text-base font-semibold">
                      Solve here
                    </h4>
                    <a
                      href={lc(activeProblem)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink2 hover:text-brand transition"
                    >
                      Open on LeetCode <ExternalLink size={13} />
                    </a>
                  </div>
                  <CodeRunner
                    key={activeProblem}
                    initialLangKey="python"
                    initialCode={pr.starter}
                    tests={pr.tests}
                    funcName={pr.func}
                    onResult={(v) => recordSubmission(activeProblem, v)}
                  />
                </div>
              </div>
            </div>
          );
        })()}
      <UpgradeModal
        open={ivUpgrade}
        feature="Mock Interview"
        onClose={() => setIvUpgrade(false)}
        onUpgrade={() => {
          setIvUpgrade(false);
          ivNav("/pricing");
        }}
      />
      <UpgradeModal
        open={solUpgrade}
        feature="AI Solutions"
        onClose={() => setSolUpgrade(false)}
        onUpgrade={() => {
          setSolUpgrade(false);
          ivNav("/pricing");
        }}
      />
      <style>{`@keyframes secUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
