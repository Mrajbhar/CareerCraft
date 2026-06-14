import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, FileText, Trash2, Clock, Eye, Pencil, Search, LayoutTemplate, Files,
  ArrowRight, Sparkles, Copy, LayoutGrid, List, Check, X, CalendarDays,
  Target, Lightbulb, TrendingUp,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Select } from "../components/ui";

const tpl = (t) =>
  t === "modern" ? { c: "#e0743a", soft: "rgba(224,116,58,.12)" }
  : t === "professional" ? { c: "#d4a23a", soft: "rgba(212,162,58,.14)" }
  : t === "minimal" ? { c: "#2dd4bf", soft: "rgba(45,212,191,.12)" }
  : t === "elegant" ? { c: "#caa05a", soft: "rgba(202,160,90,.14)" }
  : t === "compact" ? { c: "#9c6b3f", soft: "rgba(156,107,63,.16)" }
  : t === "standard" ? { c: "#1a7a61", soft: "rgba(26,122,97,.14)" }
  : t === "executive" ? { c: "#8a6d3b", soft: "rgba(138,109,59,.16)" }
  : { c: "#18a884", soft: "rgba(24,168,132,.12)" };

const hasContent = (arr) =>
  Array.isArray(arr) && arr.some((o) => o && Object.entries(o).some(([k, v]) => k !== "id" && typeof v === "string" && v.trim() !== ""));

function audit(d = {}) {
  const sections = {
    "contact info": !!(d.email || d.phone),
    "a headline": !!d.title,
    "a summary": !!d.summary,
    "work experience": hasContent(d.experience),
    "education": hasContent(d.education),
    "skills": hasContent(d.skillGroups),
    "projects": hasContent(d.projects),
    "social links": hasContent(d.links),
  };
  const keys = Object.keys(sections);
  const done = keys.filter((k) => sections[k]).length;
  return { pct: Math.round((done / keys.length) * 100), missing: keys.filter((k) => !sections[k]) };
}

function CountUp({ to = 0, ms = 900 }) {
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

/* animated circular progress ring */
function Ring({ value = 0, size = 66, stroke = 7, color = "#15634f" }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 80); return () => clearTimeout(t); }, [value]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6ddcc" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (v / 100) * circ} style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-base font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
}

/* animated bar fill */
function Bar({ pct = 0, color = "#15634f", h = 6 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 80); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="flex-1 rounded-full bg-line overflow-hidden" style={{ height: h }}>
      <div className="h-full rounded-full" style={{ width: `${w}%`, background: color, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
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

  const load = () => api.get("/resumes").then((r) => { setResumes(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (loading || resumes.length === 0) return;
    let alive = true;
    Promise.all(
      resumes.map((r) =>
        api.get(`/resumes/${r._id}`).then((res) => [r._id, audit(res.data.data)]).catch(() => [r._id, { pct: 0, missing: [] }]))
    ).then((entries) => { if (alive) setDetails(Object.fromEntries(entries)); });
    return () => { alive = false; };
  }, [loading, resumes]);

  const create = async () => {
    const r = await api.post("/resumes", { title: "Untitled Resume", data: {} });
    nav(`/builder/${r.data._id}`);
  };
  const remove = async (id) => { if (!confirm("Delete this resume?")) return; await api.delete(`/resumes/${id}`); load(); };
  const duplicate = async (id) => {
    const full = await api.get(`/resumes/${id}`);
    await api.post("/resumes", { title: `${full.data.title} (Copy)`, template: full.data.template, data: full.data.data });
    load();
  };
  const startRename = (r) => { setEditingId(r._id); setEditTitle(r.title); };
  const saveRename = async () => { await api.put(`/resumes/${editingId}`, { title: editTitle || "Untitled Resume" }); setEditingId(null); load(); };

  const stats = useMemo(() => {
    const total = resumes.length;
    const week = resumes.filter((r) => Date.now() - new Date(r.updatedAt) < 7 * 864e5).length;
    const last = resumes[0]?.updatedAt ? new Date([...resumes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0].updatedAt).toLocaleDateString() : "—";
    const top = total
      ? (() => {
          const m = {};
          resumes.forEach((r) => { const t = r.template || "classic"; m[t] = (m[t] || 0) + 1; });
          const best = Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] || "classic";
          return best.charAt(0).toUpperCase() + best.slice(1);
        })()
      : "—";
    return { total, week, last, top };
  }, [resumes]);

  const recent = useMemo(() => [...resumes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0], [resumes]);

  const dist = useMemo(() => {
    const m = {};
    resumes.forEach((r) => { const t = r.template || "classic"; m[t] = (m[t] || 0) + 1; });
    return m;
  }, [resumes]);

  const avg = useMemo(() => {
    const vals = Object.values(details).map((v) => v.pct);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [details]);

  const suggestion = useMemo(() => {
    const vals = Object.values(details);
    if (!vals.length) return null;
    const counts = {};
    vals.forEach((v) => v.missing.forEach((m) => { counts[m] = (counts[m] || 0) + 1; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return "Your resumes look complete — nice work! 🎉";
    return `${top[1]} resume${top[1] > 1 ? "s are" : " is"} missing ${top[0]}.`;
  }, [details]);

  const visible = useMemo(() => {
    let list = resumes.filter((r) => (filterTpl === "all" || r.template === filterTpl) && r.title.toLowerCase().includes(q.toLowerCase()));
    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "template") return (a.template || "").localeCompare(b.template || "");
      if (sortBy === "complete") return (details[b._id]?.pct || 0) - (details[a._id]?.pct || 0);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [resumes, q, filterTpl, sortBy, details]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const chips = ["all", "classic", "modern", "professional", "standard", "minimal", "elegant", "compact", "executive"];
  const detailsReady = Object.keys(details).length > 0;
  const statCards = [
    { icon: Files, label: "Total resumes", node: <CountUp to={stats.total} />, color: "#15634f" },
    { icon: CalendarDays, label: "Edited this week", node: <CountUp to={stats.week} />, color: "#2dd4bf" },
    { icon: Clock, label: "Last edited", node: stats.last, color: "#c6692f" },
    { icon: LayoutTemplate, label: "Top template", node: stats.top, color: "#d4a23a" },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
        @keyframes gradPan{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.10) 37%,rgba(255,255,255,.04) 63%);background-size:200% 100%;animation:shimmer 1.4s infinite}
      `}</style>

      {/* hero */}
      <section className="relative overflow-hidden rounded-3xl text-white p-7 sm:p-10 mb-6"
        style={{ background: "linear-gradient(120deg,#15634f 0%,#1a7a61 45%,#114f3f 100%)", backgroundSize: "180% 180%", animation: "fadeUp .5s ease both, gradPan 12s ease infinite" }}>
        {/* dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        {/* blobs */}
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" style={{ animation: "floatY 7s ease-in-out infinite" }} />
        <div className="absolute -bottom-20 right-32 w-56 h-56 rounded-full bg-rust/30 blur-3xl" style={{ animation: "floatY 9s ease-in-out infinite" }} />
        {/* concentric rings */}
        <div className="hidden sm:block absolute top-1/2 -right-24 -translate-y-1/2" aria-hidden>
          {[0, 1, 2].map((i) => <div key={i} className="absolute rounded-full border border-white/10" style={{ width: 200 + i * 90, height: 200 + i * 90, left: -((i * 90) / 2), top: -((200 + i * 90) / 2) }} />)}
        </div>
        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full"><Sparkles size={13} /> Dashboard</span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-3 leading-tight">{greet}, {firstName}.</h1>
          <p className="text-white/80 mt-2">
            {loading ? "Loading your workspace…" : stats.total ? `You have ${stats.total} resume${stats.total > 1 ? "s" : ""} ready to edit or share.` : "Let's create your first resume."}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={create} className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus size={18} /> New resume
              <ArrowRight size={17} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </button>
            {recent && (
              <button onClick={() => nav(`/builder/${recent._id}`)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 backdrop-blur text-white font-semibold hover:bg-white/25 transition">
                <Pencil size={16} /> Continue “{recent.title.length > 20 ? recent.title.slice(0, 20) + "…" : recent.title}”
              </button>
            )}
          </div>
        </div>
      </section>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {statCards.map((s, i) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-line bg-card p-4 sm:p-5 hover:-translate-y-1 transition-all"
            style={{ animation: "fadeUp .5s ease both", animationDelay: `${i * 70 + 70}ms` }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 20px 42px -18px ${s.color}55`)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
            <s.icon size={68} className="absolute -bottom-3 -right-2 opacity-[0.06]" style={{ color: s.color }} />
            <div className="grid place-items-center w-10 h-10 rounded-xl mb-2.5 text-white shadow-sm group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}><s.icon size={18} /></div>
            <div className="font-display text-xl sm:text-2xl font-semibold leading-none truncate">{loading ? "—" : s.node}</div>
            <div className="text-xs text-ink2 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* insights */}
      {!loading && resumes.length > 0 && detailsReady && (
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-7" style={{ animation: "fadeUp .5s ease both" }}>
          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-xs text-ink2 mb-3"><Target size={14} className="text-brand" /> Avg. completeness</div>
            <div className="flex items-center gap-4">
              <Ring value={avg} />
              <p className="text-sm text-ink2 leading-snug">{avg >= 80 ? "Looking strong — almost there." : avg >= 50 ? "Good start. Fill the gaps to stand out." : "Add more detail to boost your resumes."}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-xs text-ink2 mb-2.5"><TrendingUp size={14} className="text-brand" /> Template mix</div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(dist).map(([t, n]) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-xs capitalize w-20 shrink-0 text-ink2">{t}</span>
                  <Bar pct={(n / resumes.length) * 100} color={tpl(t).c} h={6} />
                  <span className="text-xs font-semibold w-4 text-right">{n}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 relative overflow-hidden">
            <Lightbulb size={64} className="absolute -bottom-2 -right-1 text-rust opacity-[0.07]" />
            <div className="flex items-center gap-1.5 text-xs text-ink2 mb-2"><Lightbulb size={14} className="text-rust" /> Suggestion</div>
            <p className="text-sm text-ink leading-relaxed relative">{suggestion}</p>
          </div>
        </div>
      )}

      {/* toolbar */}
      {!loading && resumes.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6" style={{ animation: "fadeUp .5s ease both", animationDelay: "320ms" }}>
          <div className="relative flex-1 max-w-sm">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resumes…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-card text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {chips.map((c) => (
              <button key={c} onClick={() => setFilterTpl(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition border ${filterTpl === c ? "bg-ink text-white border-ink" : "bg-card text-ink2 border-line hover:bg-paper"}`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Select theme="dark" width={150} value={sortBy} onChange={setSortBy}
              options={[
                { value: "recent", label: "Recent" },
                { value: "name", label: "Name A–Z" },
                { value: "template", label: "Template" },
                { value: "complete", label: "Most complete" },
              ]} />
            <div className="flex rounded-lg border border-line overflow-hidden">
              <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-brand text-white" : "bg-card text-ink2"}`}><LayoutGrid size={17} /></button>
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-brand text-white" : "bg-card text-ink2"}`}><List size={17} /></button>
            </div>
          </div>
        </div>
      )}

      {/* content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {[0, 1, 2].map((i) => <div key={i} className="h-52 rounded-2xl border border-line shimmer" />)}
        </div>
      ) : resumes.length === 0 ? (
        <Empty onCreate={create} />
      ) : visible.length === 0 ? (
        <p className="text-ink2 text-center py-16">No resumes match your filters.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {visible.map((r, i) => {
            const a = tpl(r.template);
            const pct = details[r._id]?.pct;
            return (
              <div key={r._id} className="group relative overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:-translate-y-1.5"
                style={{ animation: "fadeUp .5s ease both", animationDelay: `${i * 50 + 360}ms`, boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 24px 50px -16px ${a.c}66`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,.04)")}>
                {/* shine sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-10" style={{ background: "linear-gradient(105deg,transparent 42%,rgba(255,255,255,.45) 50%,transparent 58%)" }} />
                <div style={{ height: 6, background: a.c }} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <span className="grid place-items-center w-11 h-11 rounded-xl group-hover:scale-110 transition-transform" style={{ background: a.soft }}>
                      <FileText size={22} style={{ color: a.c }} />
                    </span>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                      <IconBtn title="Rename" onClick={() => startRename(r)}><Pencil size={15} /></IconBtn>
                      <IconBtn title="Duplicate" onClick={() => duplicate(r._id)}><Copy size={15} /></IconBtn>
                      <IconBtn title="Delete" onClick={() => remove(r._id)} danger><Trash2 size={15} /></IconBtn>
                    </div>
                  </div>

                  {editingId === r._id ? (
                    <RenameRow value={editTitle} setValue={setEditTitle} onSave={saveRename} onCancel={() => setEditingId(null)} />
                  ) : (
                    <h3 className="font-display text-lg font-semibold mt-3 truncate">{r.title}</h3>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: a.soft, color: a.c }}>{r.template}</span>
                    <span className="flex items-center gap-1 text-xs text-ink2"><Clock size={12} /> {new Date(r.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {pct !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-ink2 mb-1">
                        <span>{pct === 100 ? "Complete ✓" : "Completeness"}</span><span className="font-semibold">{pct}%</span>
                      </div>
                      <Bar pct={pct} color={a.c} h={6} />
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => nav(`/builder/${r._id}`)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition"><Pencil size={14} /> Edit</button>
                    <button onClick={() => nav(`/resume/${r._id}`)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-line bg-white text-sm font-semibold hover:bg-paper transition"><Eye size={14} /> View</button>
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
              <div key={r._id} className="group flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 hover:shadow-md hover:border-brand/30 transition"
                style={{ animation: "fadeUp .4s ease both", animationDelay: `${i * 35 + 320}ms` }}>
                <span className="grid place-items-center w-9 h-9 rounded-lg shrink-0" style={{ background: a.soft }}><FileText size={18} style={{ color: a.c }} /></span>
                {editingId === r._id ? (
                  <div className="flex-1"><RenameRow value={editTitle} setValue={setEditTitle} onSave={saveRename} onCancel={() => setEditingId(null)} /></div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{r.title}</div>
                    <div className="flex items-center gap-2 text-xs text-ink2">
                      <span className="capitalize" style={{ color: a.c }}>{r.template}</span>·
                      <span className="flex items-center gap-1"><Clock size={11} /> {new Date(r.updatedAt).toLocaleDateString()}</span>
                      {pct !== undefined && <>·<span>{pct}% complete</span></>}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn title="Edit" onClick={() => nav(`/builder/${r._id}`)}><Pencil size={15} /></IconBtn>
                  <IconBtn title="View" onClick={() => nav(`/resume/${r._id}`)}><Eye size={15} /></IconBtn>
                  <IconBtn title="Rename" onClick={() => startRename(r)}><LayoutTemplate size={15} /></IconBtn>
                  <IconBtn title="Duplicate" onClick={() => duplicate(r._id)}><Copy size={15} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => remove(r._id)} danger><Trash2 size={15} /></IconBtn>
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
  <button onClick={onClick} title={title} className={`p-2 rounded-lg transition hover:bg-paper ${danger ? "text-rust" : "text-ink2 hover:text-ink"}`}>{children}</button>
);

const RenameRow = ({ value, setValue, onSave, onCancel }) => (
  <div className="flex items-center gap-1.5 mt-3">
    <input autoFocus value={value} onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
      className="flex-1 px-2.5 py-1.5 rounded-lg border border-brand text-sm outline-none focus:ring-4 focus:ring-brand/10" />
    <button onClick={onSave} className="p-1.5 rounded-lg bg-brand text-white"><Check size={15} /></button>
    <button onClick={onCancel} className="p-1.5 rounded-lg border border-line"><X size={15} /></button>
  </div>
);

const Empty = ({ onCreate }) => (
  <div className="rounded-2xl border border-dashed border-line bg-card py-16 px-6 text-center" style={{ animation: "fadeUp .5s ease both", animationDelay: "360ms" }}>
    <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4"><FileText className="text-brand" size={26} /></div>
    <h3 className="font-display text-2xl font-semibold mb-1">No resumes yet</h3>
    <p className="text-ink2 mb-6">Create your first resume in just a few minutes.</p>
    <button onClick={onCreate} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"><Plus size={18} /> Create a resume</button>
  </div>
);