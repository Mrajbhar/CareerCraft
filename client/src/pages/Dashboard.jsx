import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Trash2,
  Clock,
  Eye,
  Pencil,
  Search,
  LayoutTemplate,
  Files,
  ArrowRight,
  Copy,
  LayoutGrid,
  List,
  Check,
  X,
  CalendarDays,
  Target,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Select } from "../components/ui";

const tpl = (t) =>
  t === "modern"
    ? { c: "#e0743a", soft: "rgba(224,116,58,.12)" }
    : t === "professional"
      ? { c: "#d4a23a", soft: "rgba(212,162,58,.14)" }
      : t === "minimal"
        ? { c: "#2dd4bf", soft: "rgba(45,212,191,.12)" }
        : t === "elegant"
          ? { c: "#caa05a", soft: "rgba(202,160,90,.14)" }
          : t === "compact"
            ? { c: "#9c6b3f", soft: "rgba(156,107,63,.16)" }
            : t === "standard"
              ? { c: "#1a7a61", soft: "rgba(26,122,97,.14)" }
              : t === "executive"
                ? { c: "#8a6d3b", soft: "rgba(138,109,59,.16)" }
                : { c: "#18a884", soft: "rgba(24,168,132,.12)" };

const hasContent = (arr) =>
  Array.isArray(arr) &&
  arr.some(
    (o) =>
      o &&
      Object.entries(o).some(
        ([k, v]) => k !== "id" && typeof v === "string" && v.trim() !== "",
      ),
  );

function audit(d = {}) {
  const sections = {
    "contact info": !!(d.email || d.phone),
    "a headline": !!d.title,
    "a summary": !!d.summary,
    "work experience": hasContent(d.experience),
    education: hasContent(d.education),
    skills: hasContent(d.skillGroups),
    projects: hasContent(d.projects),
    "social links": hasContent(d.links),
  };
  const keys = Object.keys(sections);
  const done = keys.filter((k) => sections[k]).length;
  return {
    pct: Math.round((done / keys.length) * 100),
    missing: keys.filter((k) => !sections[k]),
  };
}

function CountUp({ to = 0, ms = 800 }) {
  const [n, setN] = useState(0);
  const ref = useRef();
  useEffect(() => {
    cancelAnimationFrame(ref.current);
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [to, ms]);
  return <>{n}</>;
}

function Ring({ value = 0, size = 60, stroke = 6, color = "#18a884" }) {
  const r = (size - stroke) / 2,
    circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (v / 100) * circ}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-semibold text-ink">
        {value}%
      </span>
    </div>
  );
}

function Bar({ pct = 0, color = "#18a884", h = 5 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      className="flex-1 rounded-full bg-line overflow-hidden"
      style={{ height: h }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${w}%`,
          background: color,
          transition: "width .9s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterTpl, setFilterTpl] = useState("all");
  const [view, setView] = useState("grid");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const nav = useNavigate();

  const load = () =>
    api.get("/resumes").then((r) => {
      setResumes(r.data);
      setLoading(false);
    });
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (loading || resumes.length === 0) return;
    let alive = true;
    Promise.all(
      resumes.map((r) =>
        api
          .get(`/resumes/${r._id}`)
          .then((res) => [r._id, audit(res.data.data)])
          .catch(() => [r._id, { pct: 0, missing: [] }]),
      ),
    ).then((entries) => {
      if (alive) setDetails(Object.fromEntries(entries));
    });
    return () => {
      alive = false;
    };
  }, [loading, resumes]);

  const create = async () => {
    const r = await api.post("/resumes", {
      title: "Untitled Resume",
      data: {},
    });
    nav(`/builder/${r.data._id}`);
  };
  const remove = async (id) => {
    if (!confirm("Delete this resume?")) return;
    await api.delete(`/resumes/${id}`);
    load();
  };
  const duplicate = async (id) => {
    const full = await api.get(`/resumes/${id}`);
    await api.post("/resumes", {
      title: `${full.data.title} (Copy)`,
      template: full.data.template,
      data: full.data.data,
    });
    load();
  };
  const startRename = (r) => {
    setEditingId(r._id);
    setEditTitle(r.title);
  };
  const saveRename = async () => {
    await api.put(`/resumes/${editingId}`, {
      title: editTitle || "Untitled Resume",
    });
    setEditingId(null);
    load();
  };

  const stats = useMemo(() => {
    const total = resumes.length;
    const week = resumes.filter(
      (r) => Date.now() - new Date(r.updatedAt) < 7 * 864e5,
    ).length;
    const last = resumes[0]?.updatedAt
      ? new Date(
          [...resumes].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          )[0].updatedAt,
        ).toLocaleDateString()
      : "—";
    const top = total
      ? (() => {
          const m = {};
          resumes.forEach((r) => {
            const t = r.template || "classic";
            m[t] = (m[t] || 0) + 1;
          });
          const best =
            Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] || "classic";
          return best.charAt(0).toUpperCase() + best.slice(1);
        })()
      : "—";
    return { total, week, last, top };
  }, [resumes]);

  const recent = useMemo(
    () =>
      [...resumes].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      )[0],
    [resumes],
  );

  const dist = useMemo(() => {
    const m = {};
    resumes.forEach((r) => {
      const t = r.template || "classic";
      m[t] = (m[t] || 0) + 1;
    });
    return m;
  }, [resumes]);

  const avg = useMemo(() => {
    const vals = Object.values(details).map((v) => v.pct);
    return vals.length
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  }, [details]);

  const suggestion = useMemo(() => {
    const vals = Object.values(details);
    if (!vals.length) return null;
    const counts = {};
    vals.forEach((v) =>
      v.missing.forEach((m) => {
        counts[m] = (counts[m] || 0) + 1;
      }),
    );
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return "Your resumes look complete — nice work.";
    return `${top[1]} resume${top[1] > 1 ? "s are" : " is"} missing ${top[0]}.`;
  }, [details]);

  const visible = useMemo(() => {
    let list = resumes.filter(
      (r) =>
        (filterTpl === "all" || r.template === filterTpl) &&
        r.title.toLowerCase().includes(q.toLowerCase()),
    );
    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "template")
        return (a.template || "").localeCompare(b.template || "");
      if (sortBy === "complete")
        return (details[b._id]?.pct || 0) - (details[a._id]?.pct || 0);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [resumes, q, filterTpl, sortBy, details]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const chips = [
    "all",
    "classic",
    "modern",
    "professional",
    "standard",
    "minimal",
    "elegant",
    "compact",
    "executive",
  ];
  const detailsReady = Object.keys(details).length > 0;
  const statCards = [
    {
      icon: Files,
      label: "Total resumes",
      node: <CountUp to={stats.total} />,
      color: "#18a884",
    },
    {
      icon: CalendarDays,
      label: "Edited this week",
      node: <CountUp to={stats.week} />,
      color: "#2dd4bf",
    },
    { icon: Clock, label: "Last edited", node: stats.last, color: "#e0743a" },
    {
      icon: LayoutTemplate,
      label: "Top template",
      node: stats.top,
      color: "#d4a23a",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-9">
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 37%,rgba(255,255,255,.04) 63%);background-size:200% 100%;animation:shimmer 1.4s infinite}
      `}</style>

      {/* header */}
      <div
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8"
        style={{ animation: "fadeUp .4s ease both" }}
      >
        <div>
          <p className="text-sm text-ink2">
            {greet}, {firstName}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
            Dashboard
          </h1>
          <p className="text-ink2 mt-2 text-[15px]">
            {loading
              ? "Loading your workspace…"
              : stats.total
                ? `${stats.total} resume${stats.total > 1 ? "s" : ""} in your workspace.`
                : "Let's create your first resume."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {recent && (
            <button
              onClick={() => nav(`/builder/${recent._id}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-card text-ink font-semibold text-sm hover:border-brand/40 transition"
            >
              <Pencil size={15} /> Continue editing
            </button>
          )}
          <button
            onClick={create}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition"
          >
            <Plus size={17} /> New resume
            <ArrowRight
              size={16}
              className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"
            />
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-card p-5 hover:border-brand/40 transition-colors"
            style={{
              animation: "fadeUp .4s ease both",
              animationDelay: `${i * 50 + 40}ms`,
            }}
          >
            <span
              className="grid place-items-center w-10 h-10 rounded-xl mb-3"
              style={{ background: s.color + "1a", color: s.color }}
            >
              <s.icon size={18} />
            </span>
            <div className="font-display text-2xl font-semibold leading-none truncate">
              {loading ? "—" : s.node}
            </div>
            <div className="text-xs text-ink2 mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* insights */}
      {!loading && resumes.length > 0 && detailsReady && (
        <div
          className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8"
          style={{ animation: "fadeUp .4s ease both", animationDelay: "120ms" }}
        >
          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink2 mb-3">
              <Target size={14} className="text-brand" /> Average completeness
            </div>
            <div className="flex items-center gap-4">
              <Ring value={avg} />
              <p className="text-sm text-ink2 leading-snug">
                {avg >= 80
                  ? "Looking strong — almost there."
                  : avg >= 50
                    ? "Good start. Fill the gaps to stand out."
                    : "Add more detail to strengthen your resumes."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink2 mb-3">
              <TrendingUp size={14} className="text-brand" /> Template mix
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(dist).map(([t, n]) => (
                <div key={t} className="flex items-center gap-2.5">
                  <span className="text-xs capitalize w-20 shrink-0 text-ink2">
                    {t}
                  </span>
                  <Bar
                    pct={(n / resumes.length) * 100}
                    color={tpl(t).c}
                    h={5}
                  />
                  <span className="text-xs font-semibold w-4 text-right text-ink">
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink2 mb-3">
              <Lightbulb size={14} className="text-brand" /> Suggestion
            </div>
            <p className="text-sm text-ink leading-relaxed">{suggestion}</p>
          </div>
        </div>
      )}

      {/* toolbar */}
      {!loading && resumes.length > 0 && (
        <div
          className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6"
          style={{ animation: "fadeUp .4s ease both", animationDelay: "160ms" }}
        >
          <div className="relative flex-1 max-w-sm">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resumes…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setFilterTpl(c)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold capitalize transition border ${filterTpl === c ? "bg-ink text-white border-ink" : "bg-card text-ink2 border-line hover:text-ink"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <Select
              theme="dark"
              width={150}
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "recent", label: "Recent" },
                { value: "name", label: "Name A–Z" },
                { value: "template", label: "Template" },
                { value: "complete", label: "Most complete" },
              ]}
            />
            <div className="flex rounded-lg border border-line overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-brand text-white" : "bg-card text-ink2 hover:text-ink"}`}
              >
                <LayoutGrid size={17} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-brand text-white" : "bg-card text-ink2 hover:text-ink"}`}
              >
                <List size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl border border-line shimmer"
            />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <Empty onCreate={create} />
      ) : visible.length === 0 ? (
        <p className="text-ink2 text-center py-16">
          No resumes match your filters.
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {visible.map((r, i) => {
            const a = tpl(r.template);
            const pct = details[r._id]?.pct;
            return (
              <div
                key={r._id}
                className="group relative overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:border-brand/40 hover:-translate-y-0.5"
                style={{
                  animation: "fadeUp .4s ease both",
                  animationDelay: `${i * 40 + 200}ms`,
                }}
              >
                <div style={{ height: 3, background: a.c }} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <span
                      className="grid place-items-center w-10 h-10 rounded-xl"
                      style={{ background: a.soft }}
                    >
                      <FileText size={20} style={{ color: a.c }} />
                    </span>
                    <div className="flex gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                      <IconBtn title="Rename" onClick={() => startRename(r)}>
                        <Pencil size={15} />
                      </IconBtn>
                      <IconBtn
                        title="Duplicate"
                        onClick={() => duplicate(r._id)}
                      >
                        <Copy size={15} />
                      </IconBtn>
                      <IconBtn
                        title="Delete"
                        onClick={() => remove(r._id)}
                        danger
                      >
                        <Trash2 size={15} />
                      </IconBtn>
                    </div>
                  </div>

                  {editingId === r._id ? (
                    <RenameRow
                      value={editTitle}
                      setValue={setEditTitle}
                      onSave={saveRename}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <h3 className="font-semibold text-[15px] mt-3 truncate">
                      {r.title}
                    </h3>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-ink2">
                    <span
                      className="capitalize font-medium"
                      style={{ color: a.c }}
                    >
                      {r.template}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />{" "}
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {pct !== undefined && (
                    <div className="mt-3.5">
                      <div className="flex justify-between text-[11px] text-ink2 mb-1.5">
                        <span>{pct === 100 ? "Complete" : "Completeness"}</span>
                        <span className="font-semibold text-ink">{pct}%</span>
                      </div>
                      <Bar pct={pct} color={a.c} h={5} />
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => nav(`/builder/${r._id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => nav(`/resume/${r._id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-line bg-paper/40 text-sm font-semibold text-ink2 hover:text-ink hover:border-brand/30 transition"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((r, i) => {
            const a = tpl(r.template);
            const pct = details[r._id]?.pct;
            return (
              <div
                key={r._id}
                className="group flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 hover:border-brand/40 transition"
                style={{
                  animation: "fadeUp .35s ease both",
                  animationDelay: `${i * 25 + 160}ms`,
                }}
              >
                <span
                  className="grid place-items-center w-9 h-9 rounded-lg shrink-0"
                  style={{ background: a.soft }}
                >
                  <FileText size={18} style={{ color: a.c }} />
                </span>
                {editingId === r._id ? (
                  <div className="flex-1">
                    <RenameRow
                      value={editTitle}
                      setValue={setEditTitle}
                      onSave={saveRename}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[15px] truncate">
                      {r.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink2">
                      <span className="capitalize" style={{ color: a.c }}>
                        {r.template}
                      </span>
                      ·
                      <span className="flex items-center gap-1">
                        <Clock size={11} />{" "}
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </span>
                      {pct !== undefined && (
                        <>
                          ·<span>{pct}% complete</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-0.5 shrink-0">
                  <IconBtn
                    title="Edit"
                    onClick={() => nav(`/builder/${r._id}`)}
                  >
                    <Pencil size={15} />
                  </IconBtn>
                  <IconBtn title="View" onClick={() => nav(`/resume/${r._id}`)}>
                    <Eye size={15} />
                  </IconBtn>
                  <IconBtn title="Rename" onClick={() => startRename(r)}>
                    <LayoutTemplate size={15} />
                  </IconBtn>
                  <IconBtn title="Duplicate" onClick={() => duplicate(r._id)}>
                    <Copy size={15} />
                  </IconBtn>
                  <IconBtn title="Delete" onClick={() => remove(r._id)} danger>
                    <Trash2 size={15} />
                  </IconBtn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const IconBtn = ({ children, onClick, title, danger }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition hover:bg-paper ${danger ? "text-ink2 hover:text-rust" : "text-ink2 hover:text-ink"}`}
  >
    {children}
  </button>
);

const RenameRow = ({ value, setValue, onSave, onCancel }) => (
  <div className="flex items-center gap-1.5 mt-3">
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave();
        if (e.key === "Escape") onCancel();
      }}
      className="flex-1 px-2.5 py-1.5 rounded-lg border border-brand bg-paper/50 text-sm outline-none focus:ring-4 focus:ring-brand/10"
    />
    <button onClick={onSave} className="p-1.5 rounded-lg bg-brand text-white">
      <Check size={15} />
    </button>
    <button
      onClick={onCancel}
      className="p-1.5 rounded-lg border border-line text-ink2"
    >
      <X size={15} />
    </button>
  </div>
);

const Empty = ({ onCreate }) => (
  <div
    className="rounded-2xl border border-dashed border-line bg-card py-16 px-6 text-center"
    style={{ animation: "fadeUp .4s ease both", animationDelay: "120ms" }}
  >
    <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4">
      <FileText className="text-brand" size={26} />
    </div>
    <h3 className="font-display text-2xl font-semibold mb-1">No resumes yet</h3>
    <p className="text-ink2 mb-6">
      Create your first resume in just a few minutes.
    </p>
    <button
      onClick={onCreate}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
    >
      <Plus size={18} /> Create a resume
    </button>
  </div>
);
