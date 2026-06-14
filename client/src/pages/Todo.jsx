import { useState, useEffect, useRef, useMemo } from "react";
import {
  ListChecks, Plus, Trash2, Check, Pencil, X, Calendar, Sparkles, ClipboardList,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Select } from "../components/ui";

const PRIOS = [
  { value: "high", label: "High priority" },
  { value: "med", label: "Medium priority" },
  { value: "low", label: "Low priority" },
];
const prioMeta = (p) =>
  p === "high"
    ? { c: "#e0743a", label: "High" }
    : p === "low"
    ? { c: "#2dd4bf", label: "Low" }
    : { c: "#d4a23a", label: "Med" };
const prioWeight = (p) => (p === "high" ? 3 : p === "med" ? 2 : 1);

const STARTER = [
  "Polish my resume in the Builder",
  "Run the ATS checker on my resume",
  "Tailor my resume to a target job description",
  "Generate a cover letter for a role",
  "Apply to 5 roles this week",
  "Practice 3 DSA problems",
  "Prepare answers to common behavioral questions",
  "Follow up on applications after one week",
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Todo() {
  const { user } = useAuth();
  const KEY = `careercraft-todos-${user?.email || user?.id || "me"}`;

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [prio, setPrio] = useState("med");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const loaded = useRef(false);

  // load + persist (per user, in this browser)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setTodos(raw ? JSON.parse(raw) : []);
    } catch {
      setTodos([]);
    }
    loaded.current = true;
  }, [KEY]);
  useEffect(() => {
    if (loaded.current) localStorage.setItem(KEY, JSON.stringify(todos));
  }, [todos, KEY]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((d) => [{ id: Date.now(), text: t, done: false, prio, due, created: Date.now() }, ...d]);
    setText("");
    setDue("");
    setPrio("med");
  };
  const toggle = (id) => setTodos((d) => d.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) => setTodos((d) => d.filter((x) => x.id !== id));
  const clearDone = () => setTodos((d) => d.filter((x) => !x.done));
  const seedStarter = () =>
    setTodos((d) => [
      ...STARTER.map((t, i) => ({ id: Date.now() + i, text: t, done: false, prio: "med", due: "", created: Date.now() + i })),
      ...d,
    ]);

  const startEdit = (t) => { setEditId(t.id); setEditText(t.text); };
  const saveEdit = () => {
    setTodos((d) => d.map((x) => (x.id === editId ? { ...x, text: editText.trim() || x.text } : x)));
    setEditId(null); setEditText("");
  };

  const counts = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.done).length;
    return { total, done, active: total - done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [todos]);

  const visible = useMemo(() => {
    let list = todos.filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true));
    return [...list].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;           // active first
      if (prioWeight(b.prio) !== prioWeight(a.prio)) return prioWeight(b.prio) - prioWeight(a.prio);
      if (a.due && b.due) return a.due.localeCompare(b.due);   // sooner due first
      if (a.due) return -1;
      if (b.due) return 1;
      return b.created - a.created;
    });
  }, [todos, filter]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <style>{`@keyframes rowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

      {/* header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/10">
            <ListChecks className="text-brand" size={26} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight">To-Do</h1>
            <p className="text-ink2 text-sm mt-0.5">Track your job-search tasks and stay on top of every step.</p>
          </div>
        </div>
        {counts.total > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-2.5">
            <div className="text-right">
              <div className="font-display text-xl font-semibold leading-none" style={{ color: counts.pct === 100 ? "#15634f" : "#d4a23a" }}>{counts.pct}%</div>
              <div className="text-[11px] text-ink2 mt-0.5">{counts.done}/{counts.total} done</div>
            </div>
            <div className="w-24 h-2 rounded-full bg-line overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${counts.pct}%`, background: "linear-gradient(90deg,#18a884,#2dd4bf)", transition: "width .5s ease" }} />
            </div>
          </div>
        )}
      </div>

      {/* add bar */}
      <div className="rounded-2xl border border-line bg-card p-3 sm:p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") add(); }}
            placeholder="Add a task…"
            className="flex-1 rounded-xl border border-line bg-paper/50 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand transition"
          />
          <div className="flex gap-2.5">
            <Select theme="dark" width={150} value={prio} onChange={setPrio} options={PRIOS} />
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="rounded-xl border border-line bg-paper/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand transition"
              style={{ colorScheme: "dark" }}
            />
            <button
              onClick={add}
              disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold disabled:opacity-50 hover:bg-brand-dark transition shrink-0">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* filters */}
      {counts.total > 0 && (
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="inline-flex rounded-xl border border-line overflow-hidden">
            {[["all", `All ${counts.total}`], ["active", `Active ${counts.active}`], ["done", `Done ${counts.done}`]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-4 py-2 text-sm font-semibold transition ${filter === k ? "bg-brand text-white" : "bg-card text-ink2 hover:text-ink"}`}>{l}</button>
            ))}
          </div>
          {counts.done > 0 && (
            <button onClick={clearDone} className="text-sm font-semibold text-ink2 hover:text-rust transition inline-flex items-center gap-1.5">
              <Trash2 size={14} /> Clear completed
            </button>
          )}
        </div>
      )}

      {/* list */}
      {counts.total === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card py-14 px-6 text-center">
          <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl bg-brand/10 mb-4"><ClipboardList className="text-brand" size={26} /></div>
          <h3 className="font-display text-xl font-semibold mb-1">No tasks yet</h3>
          <p className="text-ink2 mb-6 text-sm">Add your own, or start with a ready-made job-search checklist.</p>
          <button onClick={seedStarter} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition">
            <Sparkles size={18} /> Add starter job-search checklist
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-ink2 text-center py-12">Nothing here — try a different filter.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((t) => {
            const m = prioMeta(t.prio);
            const overdue = t.due && !t.done && t.due < todayStr();
            return (
              <div key={t.id} className="group flex items-center gap-3 rounded-xl border border-line bg-card px-3.5 py-3 hover:border-brand/30 transition"
                style={{ animation: "rowIn .25s ease both" }}>
                <button onClick={() => toggle(t.id)} title={t.done ? "Mark as not done" : "Mark as done"}
                  className="shrink-0 grid place-items-center w-6 h-6 rounded-full border transition"
                  style={{ borderColor: t.done ? "#18a884" : "var(--color-line)", background: t.done ? "#18a884" : "transparent" }}>
                  {t.done && <Check size={14} className="text-white" />}
                </button>

                {editId === t.id ? (
                  <div className="flex-1 flex items-center gap-1.5">
                    <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setEditId(null); } }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-brand bg-paper/50 text-sm text-ink outline-none" />
                    <button onClick={saveEdit} className="p-1.5 rounded-lg bg-brand text-white"><Check size={15} /></button>
                    <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg border border-line text-ink2"><X size={15} /></button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${t.done ? "line-through text-ink2" : "text-ink"}`}>{t.text}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: m.c, background: m.c + "1a" }}>{m.label}</span>
                      {t.due && (
                        <span className={`inline-flex items-center gap-1 text-[11px] ${overdue ? "text-rust font-semibold" : "text-ink2"}`}>
                          <Calendar size={11} /> {new Date(t.due + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}{overdue ? " · overdue" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {editId !== t.id && (
                  <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button onClick={() => startEdit(t)} title="Edit" className="p-2 rounded-lg text-ink2 hover:text-ink hover:bg-paper transition"><Pencil size={15} /></button>
                    <button onClick={() => remove(t.id)} title="Delete" className="p-2 rounded-lg text-rust hover:bg-rust/10 transition"><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {counts.total > 0 && (
        <p className="text-xs text-ink2 text-center mt-6">Your tasks are saved in this browser. Want them synced to your account across devices? Just ask.</p>
      )}
    </div>
  );
}