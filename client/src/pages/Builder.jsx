import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code2,
  Star,
  Download,
  FileText,
  Check,
  Loader2,
  Award,
  Trophy,
  Link as LinkIcon,
  LayoutList,
  Plus,
  ClipboardCheck,
  X,
  ChevronDown,
  Eye,
  PencilLine,
  ArrowLeft,
} from "lucide-react";
import api from "../api";
import {
  Field,
  AiBtn,
  AddBtn,
  Card,
  DownloadBtn,
  BulletEditor,
} from "../components/ui";
import { ResumeStyles, ResumePreview } from "../components/ResumeTemplates";
import { exportPDF, exportWord } from "../lib/exportResume";

const emptyData = {
  firstName: "",
  lastName: "",
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  preferences: {},
  links: [],
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skillGroups: [],
  certifications: [],
  achievements: [],
  custom: [],
};

function migrate(d = {}) {
  const out = { ...emptyData, ...d };
  if (!out.links?.length && d.link)
    out.links = [{ id: Date.now(), label: "", url: d.link }];
  if (!out.skillGroups?.length && d.skills)
    out.skillGroups = [
      { id: Date.now() + 1, category: "Skills", items: d.skills },
    ];
  if (!out.firstName && !out.lastName && out.name) {
    const p = out.name.trim().split(/\s+/);
    out.firstName = p.shift() || "";
    out.lastName = p.join(" ");
  }
  out.preferences ||= {};
  [
    "links",
    "experience",
    "projects",
    "education",
    "skillGroups",
    "certifications",
    "achievements",
    "custom",
  ].forEach((k) => {
    out[k] ||= [];
  });
  return out;
}

const PREFS = [
  ["remote", "Open to Remote"],
  ["relocate", "Open to Relocate"],
  ["hybrid", "Open to Hybrid"],
  ["travel", "Open to Travel"],
  ["onsite", "Open to On-Site"],
];

/* animated accordion section */
function Acc({
  id,
  icon: Icon,
  title,
  count,
  action,
  open,
  setOpen,
  children,
}) {
  const isOpen = open === id;
  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden shrink-0">
      <div className="flex items-center justify-between gap-2 pr-3">
        <button
          onClick={() => setOpen(isOpen ? null : id)}
          className="flex-1 flex items-center gap-3 px-4 py-3.5 text-left min-w-0"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand/10 text-brand shrink-0">
            <Icon size={17} />
          </span>
          <span className="font-semibold truncate">{title}</span>
          {count > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand shrink-0">
              {count}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 shrink-0">
          {isOpen && action}
          <button onClick={() => setOpen(isOpen ? null : id)} className="p-1">
            <ChevronDown
              size={18}
              className="text-ink2 transition-transform"
              style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
            />
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows .35s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-4 pb-4 pt-1 flex flex-col gap-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

const Hint = ({ children }) => (
  <p className="text-xs text-ink2 mb-1">{children}</p>
);

/* ---- live resume scoring (quality, not just completeness) ---- */
const hasC = (arr) =>
  Array.isArray(arr) &&
  arr.some(
    (o) =>
      o &&
      Object.entries(o).some(
        ([k, v]) => k !== "id" && typeof v === "string" && v.trim() !== "",
      ),
  );
function scoreResume(d = {}) {
  let s = 0;
  const tips = [];
  if (d.email) s += 5;
  else tips.push("Add your email address.");
  if (d.phone) s += 5;
  else tips.push("Add a phone number.");
  if (d.location || d.city) s += 5;
  else tips.push("Add your location.");
  if (d.title) s += 8;
  else tips.push("Add a headline / target job title.");
  if (d.summary && d.summary.trim()) {
    s += 7;
    if (d.summary.trim().length >= 200) s += 5;
    else tips.push("Expand your summary to 2–3 full sentences.");
  } else tips.push("Write a professional summary.");
  if (hasC(d.experience)) {
    s += 12;
    const bullets = (d.experience || [])
      .flatMap((e) => (e.bullets || "").split("\n"))
      .filter((b) => b.trim());
    if (bullets.length) s += 8;
    else tips.push("Add bullet points to your work experience.");
    if (bullets.some((b) => /\d/.test(b))) s += 12;
    else
      tips.push(
        "Quantify achievements with numbers (e.g. “cut load time 40%”).",
      );
  } else tips.push("Add your work experience.");
  if (hasC(d.education)) s += 8;
  else tips.push("Add your education.");
  if (hasC(d.skillGroups)) s += 10;
  else tips.push("Add a skills section.");
  if (hasC(d.projects)) s += 7;
  else tips.push("Add a project to showcase your work.");
  if (hasC(d.links)) s += 8;
  else tips.push("Add LinkedIn / GitHub / portfolio links.");
  s = Math.min(100, s);
  const grade =
    s >= 85
      ? "Excellent"
      : s >= 70
        ? "Strong"
        : s >= 40
          ? "Getting there"
          : "Needs work";
  const color =
    s >= 85 ? "#15634f" : s >= 70 ? "#d4a23a" : s >= 40 ? "#c6692f" : "#b04a36";
  return { score: s, grade, color, tips };
}

function ScoreRing({ value, color, size = 60 }) {
  const stroke = 6,
    r = (size - stroke) / 2,
    c = 2 * Math.PI * r,
    off = c * (1 - value / 100);
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ScoreCard({ data }) {
  const { score, grade, color, tips } = useMemo(
    () => scoreResume(data),
    [data],
  );
  return (
    <div className="rounded-xl border border-line bg-card p-4 shrink-0">
      <div className="flex items-center gap-3">
        <ScoreRing value={score} color={color} />
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-ink2 font-semibold">
            Resume score
          </div>
          <div
            className="font-display text-lg font-semibold leading-tight"
            style={{ color }}
          >
            {grade}
          </div>
          <div className="text-xs text-ink2">
            {tips.length
              ? `${tips.length} suggestion${tips.length > 1 ? "s" : ""} to improve`
              : "Looking great! 🎉"}
          </div>
        </div>
      </div>
      {tips.length > 0 && (
        <ul className="mt-3 pt-3 border-t border-line flex flex-col gap-1.5">
          {tips.slice(0, 3).map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-ink2">
              <span style={{ color }} className="mt-px font-bold">
                ›
              </span>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Builder() {
  const { id } = useParams();
  const nav = useNavigate();
  const [docTitle, setDocTitle] = useState("Untitled Resume");
  const [template, setTemplate] = useState("classic");
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState({});
  const [review, setReview] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [openSec, setOpenSec] = useState("personal");
  const [tab, setTab] = useState("edit");
  const first = useRef(true);

  useEffect(() => {
    api
      .get(`/resumes/${id}`)
      .then((r) => {
        setDocTitle(r.data.title || "Untitled Resume");
        setTemplate(r.data.template || "classic");
        setData(migrate(r.data.data));
        setLoading(false);
      })
      .catch(() => nav("/"));
  }, [id, nav]);

  useEffect(() => {
    if (loading) return;
    if (first.current) {
      first.current = false;
      return;
    }
    setSaved(false);
    const t = setTimeout(() => {
      api
        .put(`/resumes/${id}`, { title: docTitle, template, data })
        .then(() => setSaved(true));
    }, 1000);
    return () => clearTimeout(t);
  }, [data, docTitle, template, id, loading]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setName = (k, v) =>
    setData((d) => {
      const n = { ...d, [k]: v };
      n.name = `${n.firstName || ""} ${n.lastName || ""}`.trim();
      return n;
    });
  const pref = (k) =>
    setData((d) => ({
      ...d,
      preferences: { ...(d.preferences || {}), [k]: !d.preferences?.[k] },
    }));
  const add = (key, item) =>
    setData((d) => ({ ...d, [key]: [...d[key], { ...item, id: Date.now() }] }));
  const upd = (key, iid, f, val) =>
    setData((d) => ({
      ...d,
      [key]: d[key].map((x) => (x.id === iid ? { ...x, [f]: val } : x)),
    }));
  const del = (key, iid) =>
    setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== iid) }));
  const flag = (k, v) => setBusy((b) => ({ ...b, [k]: v }));

  const addCustom = () => {
    const cid = Date.now();
    setData((d) => ({
      ...d,
      custom: [...d.custom, { id: cid, title: "New Section", items: [] }],
    }));
    setOpenSec("custom-" + cid);
  };
  const updCustom = (sid, f, val) => upd("custom", sid, f, val);
  const addCustomItem = (sid) =>
    setData((d) => ({
      ...d,
      custom: d.custom.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: Date.now(),
                  heading: "",
                  subheading: "",
                  period: "",
                  bullets: "",
                },
              ],
            }
          : s,
      ),
    }));
  const updCustomItem = (sid, iid, f, val) =>
    setData((d) => ({
      ...d,
      custom: d.custom.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: s.items.map((it) =>
                it.id === iid ? { ...it, [f]: val } : it,
              ),
            }
          : s,
      ),
    }));
  const delCustomItem = (sid, iid) =>
    setData((d) => ({
      ...d,
      custom: d.custom.map((s) =>
        s.id === sid
          ? { ...s, items: s.items.filter((it) => it.id !== iid) }
          : s,
      ),
    }));

  const aiSummary = async () => {
    flag("summary", true);
    try {
      const res = await api.post("/ai/summary", {
        title: data.title,
        skills: data.skillGroups.map((g) => g.items).join(", "),
        experience: data.experience,
      });
      if (res.data.text) set("summary", res.data.text);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "AI request failed.",
      );
    }
    flag("summary", false);
  };
  const aiBullets = async (exp) => {
    flag("exp" + exp.id, true);
    try {
      const res = await api.post("/ai/bullets", {
        role: exp.role,
        company: exp.company,
        notes: exp.bullets,
      });
      if (res.data.text) upd("experience", exp.id, "bullets", res.data.text);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "AI request failed.",
      );
    }
    flag("exp" + exp.id, false);
  };
  const aiReview = async () => {
    setReviewing(true);
    setReview("");
    try {
      const res = await api.post("/ai/review", { data });
      setReview(res.data.text || "No feedback returned.");
    } catch (err) {
      setReview(null);
      alert(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "AI review failed.",
      );
    }
    setReviewing(false);
  };

  if (loading) return <p style={{ padding: 30 }}>Loading…</p>;

  const previewData = {
    ...data,
    name: data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
  };
  const acc = (id2) => ({ id: id2, open: openSec, setOpen: setOpenSec });

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <ResumeStyles />
      <style>{`.builder-editor > *{ animation: secUp .42s cubic-bezier(.22,1,.36,1) both; }`}</style>

      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-line bg-card px-3 sm:px-4 py-2.5">
          <button
            onClick={() => nav("/dashboard")}
            title="Back to dashboard"
            className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-ink2 hover:text-ink hover:-translate-y-0.5 transition shrink-0"
          >
            <ArrowLeft size={17} />
          </button>
          <input
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Untitled Resume"
            className="font-display text-lg sm:text-2xl font-semibold bg-transparent border-none outline-none flex-1 min-w-0 text-ink"
          />
          <span className="text-xs text-ink2 hidden sm:flex items-center gap-1.5 shrink-0">
            {saved ? (
              <>
                <Check size={14} className="text-brand" /> Saved
              </>
            ) : (
              <>
                <Loader2 size={13} className="animate-spin" /> Saving…
              </>
            )}
          </span>
          <button
            onClick={aiReview}
            disabled={reviewing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-60 hover:bg-brand-dark transition shrink-0"
          >
            {reviewing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ClipboardCheck size={15} />
            )}{" "}
            <span className="hidden sm:inline">AI Review</span>
          </button>
        </div>
      </div>

      <div className="lg:hidden px-4 sm:px-6 mt-3">
        <div className="flex rounded-xl border border-line overflow-hidden">
          {[
            ["edit", "Edit", PencilLine],
            ["preview", "Preview", Eye],
          ].map(([k, l, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold ${tab === k ? "bg-brand text-white" : "bg-card text-ink2"}`}
            >
              <Icon size={16} /> {l}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:flex lg:items-start">
        {/* EDITOR */}
        <div
          className={`builder-editor ${tab === "edit" ? "flex" : "hidden"} lg:flex flex-col gap-3 w-full lg:w-[500px] xl:w-[540px] lg:shrink-0 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:border-r lg:border-line px-4 sm:px-6 py-4`}
        >
          <ScoreCard data={data} />

          <Acc {...acc("personal")} icon={User} title="Personal Information">
            <div className="grid grid-cols-2 gap-2.5">
              <Field
                label="First Name"
                value={data.firstName}
                onChange={(v) => setName("firstName", v)}
              />
              <Field
                label="Last Name"
                value={data.lastName}
                onChange={(v) => setName("lastName", v)}
              />
            </div>
            <Field
              label="Headline / Target Job Title"
              value={data.title}
              onChange={(v) => set("title", v)}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <Field
                label="Email"
                value={data.email}
                onChange={(v) => set("email", v)}
              />
              <Field
                label="Phone Number"
                value={data.phone}
                onChange={(v) => set("phone", v)}
              />
            </div>
            <Field
              label="Location (shown on resume)"
              value={data.location}
              onChange={(v) => set("location", v)}
              placeholder="Mumbai, India"
            />
            <Field
              label="Address"
              value={data.address}
              onChange={(v) => set("address", v)}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <Field
                label="City"
                value={data.city}
                onChange={(v) => set("city", v)}
              />
              <Field
                label="State"
                value={data.state}
                onChange={(v) => set("state", v)}
              />
              <Field
                label="Country"
                value={data.country}
                onChange={(v) => set("country", v)}
              />
              <Field
                label="Zip Code"
                value={data.zip}
                onChange={(v) => set("zip", v)}
              />
            </div>
            <div className="text-xs font-semibold text-ink2 mt-1 mb-1.5">
              Work Preferences
            </div>
            <div className="flex flex-wrap gap-2">
              {PREFS.map(([k, l]) => {
                const on = !!data.preferences?.[k];
                return (
                  <button
                    key={k}
                    onClick={() => pref(k)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${on ? "bg-brand text-white border-brand" : "bg-white text-ink2 border-line hover:border-brand"}`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </Acc>

          <Acc
            {...acc("links")}
            icon={LinkIcon}
            title="Website & Social Links"
            count={data.links.length}
            action={
              <AddBtn onClick={() => add("links", { label: "", url: "" })} />
            }
          >
            {data.links.length === 0 && (
              <Hint>Add LinkedIn, GitHub, Portfolio…</Hint>
            )}
            {data.links.map((l) => (
              <Card key={l.id} onDel={() => del("links", l.id)}>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    label="Label"
                    value={l.label}
                    onChange={(v) => upd("links", l.id, "label", v)}
                    placeholder="LinkedIn"
                  />
                  <Field
                    label="URL"
                    value={l.url}
                    onChange={(v) => upd("links", l.id, "url", v)}
                    placeholder="linkedin.com/in/you"
                  />
                </div>
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("summary")}
            icon={Sparkles}
            title="Professional Summary"
            action={
              <AiBtn
                onClick={aiSummary}
                loading={busy.summary}
                label="AI write"
              />
            }
          >
            <Field
              area
              value={data.summary}
              onChange={(v) => set("summary", v)}
              placeholder="Short pitch about you…"
            />
          </Acc>

          <Acc
            {...acc("experience")}
            icon={Briefcase}
            title="Work Experience"
            count={data.experience.length}
            action={
              <AddBtn
                onClick={() =>
                  add("experience", {
                    role: "",
                    company: "",
                    location: "",
                    period: "",
                    bullets: "",
                  })
                }
              />
            }
          >
            {data.experience.length === 0 && (
              <Hint>Add your roles, newest first.</Hint>
            )}
            {data.experience.map((e) => (
              <Card key={e.id} onDel={() => del("experience", e.id)}>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    label="Role"
                    value={e.role}
                    onChange={(v) => upd("experience", e.id, "role", v)}
                  />
                  <Field
                    label="Company"
                    value={e.company}
                    onChange={(v) => upd("experience", e.id, "company", v)}
                  />
                  <Field
                    label="Location"
                    value={e.location}
                    onChange={(v) => upd("experience", e.id, "location", v)}
                  />
                  <Field
                    label="Period"
                    value={e.period}
                    onChange={(v) => upd("experience", e.id, "period", v)}
                    placeholder="2022 — Present"
                  />
                </div>
                <BulletEditor
                  label="Achievements"
                  value={e.bullets}
                  onChange={(v) => upd("experience", e.id, "bullets", v)}
                />
                <AiBtn
                  onClick={() => aiBullets(e)}
                  loading={busy["exp" + e.id]}
                  label="AI polish bullets"
                />
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("projects")}
            icon={Code2}
            title="Projects"
            count={data.projects.length}
            action={
              <AddBtn
                onClick={() =>
                  add("projects", { name: "", tech: "", link: "", desc: "" })
                }
              />
            }
          >
            {data.projects.map((p) => (
              <Card key={p.id} onDel={() => del("projects", p.id)}>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    label="Project name"
                    value={p.name}
                    onChange={(v) => upd("projects", p.id, "name", v)}
                  />
                  <Field
                    label="Tech used"
                    value={p.tech}
                    onChange={(v) => upd("projects", p.id, "tech", v)}
                  />
                </div>
                <Field
                  label="Link"
                  value={p.link}
                  onChange={(v) => upd("projects", p.id, "link", v)}
                  placeholder="github.com/you/project"
                />
                <Field
                  area
                  label="Description"
                  value={p.desc}
                  onChange={(v) => upd("projects", p.id, "desc", v)}
                />
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("skills")}
            icon={Star}
            title="Skills & Interests"
            count={data.skillGroups.length}
            action={
              <AddBtn
                onClick={() => add("skillGroups", { category: "", items: "" })}
              />
            }
          >
            {data.skillGroups.map((g) => (
              <Card key={g.id} onDel={() => del("skillGroups", g.id)}>
                <Field
                  label="Category"
                  value={g.category}
                  onChange={(v) => upd("skillGroups", g.id, "category", v)}
                  placeholder="Programming Languages"
                />
                <Field
                  label="Items (comma separated)"
                  value={g.items}
                  onChange={(v) => upd("skillGroups", g.id, "items", v)}
                  placeholder="C#, JavaScript, SQL"
                />
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("education")}
            icon={GraduationCap}
            title="Education"
            count={data.education.length}
            action={
              <AddBtn
                onClick={() =>
                  add("education", {
                    school: "",
                    degree: "",
                    period: "",
                    detail: "",
                  })
                }
              />
            }
          >
            {data.education.map((e) => (
              <Card key={e.id} onDel={() => del("education", e.id)}>
                <Field
                  label="School"
                  value={e.school}
                  onChange={(v) => upd("education", e.id, "school", v)}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    label="Degree"
                    value={e.degree}
                    onChange={(v) => upd("education", e.id, "degree", v)}
                  />
                  <Field
                    label="Period"
                    value={e.period}
                    onChange={(v) => upd("education", e.id, "period", v)}
                  />
                </div>
                <Field
                  label="Detail (GPA, honors)"
                  value={e.detail}
                  onChange={(v) => upd("education", e.id, "detail", v)}
                />
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("awards")}
            icon={Trophy}
            title="Awards & Achievements"
            count={data.achievements.length}
            action={
              <AddBtn onClick={() => add("achievements", { text: "" })} />
            }
          >
            {data.achievements.map((a) => (
              <Card key={a.id} onDel={() => del("achievements", a.id)}>
                <Field
                  value={a.text}
                  onChange={(v) => upd("achievements", a.id, "text", v)}
                  placeholder="Won Smart India Hackathon 2024"
                />
              </Card>
            ))}
          </Acc>

          <Acc
            {...acc("certs")}
            icon={Award}
            title="Certifications"
            count={data.certifications.length}
            action={
              <AddBtn
                onClick={() =>
                  add("certifications", { name: "", issuer: "", year: "" })
                }
              />
            }
          >
            {data.certifications.map((c) => (
              <Card key={c.id} onDel={() => del("certifications", c.id)}>
                <Field
                  label="Name"
                  value={c.name}
                  onChange={(v) => upd("certifications", c.id, "name", v)}
                  placeholder="AWS Solutions Architect"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <Field
                    label="Issuer"
                    value={c.issuer}
                    onChange={(v) => upd("certifications", c.id, "issuer", v)}
                    placeholder="Amazon"
                  />
                  <Field
                    label="Year"
                    value={c.year}
                    onChange={(v) => upd("certifications", c.id, "year", v)}
                    placeholder="2024"
                  />
                </div>
              </Card>
            ))}
          </Acc>

          {data.custom.map((sec) => (
            <Acc
              key={sec.id}
              {...acc("custom-" + sec.id)}
              icon={LayoutList}
              title={sec.title || "Section"}
              count={(sec.items || []).length}
              action={<AddBtn onClick={() => addCustomItem(sec.id)} />}
            >
              <Field
                label="Section title"
                value={sec.title}
                onChange={(v) => updCustom(sec.id, "title", v)}
                placeholder="Publications / Volunteering"
              />
              {(sec.items || []).map((it) => (
                <Card key={it.id} onDel={() => delCustomItem(sec.id, it.id)}>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field
                      label="Heading"
                      value={it.heading}
                      onChange={(v) =>
                        updCustomItem(sec.id, it.id, "heading", v)
                      }
                    />
                    <Field
                      label="Subheading"
                      value={it.subheading}
                      onChange={(v) =>
                        updCustomItem(sec.id, it.id, "subheading", v)
                      }
                    />
                  </div>
                  <Field
                    label="Period"
                    value={it.period}
                    onChange={(v) => updCustomItem(sec.id, it.id, "period", v)}
                  />
                  <BulletEditor
                    label="Details"
                    value={it.bullets}
                    onChange={(v) => updCustomItem(sec.id, it.id, "bullets", v)}
                  />
                </Card>
              ))}
              <button
                onClick={() => del("custom", sec.id)}
                className="text-xs font-semibold text-rust border border-line bg-white rounded-lg px-3 py-1.5 mt-1 self-start"
              >
                Remove section
              </button>
            </Acc>
          ))}

          <button
            onClick={addCustom}
            className="w-full py-3.5 rounded-xl border border-dashed border-brand text-brand font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand/5 transition shrink-0"
          >
            <Plus size={18} /> Add new section
          </button>
        </div>

        {/* PREVIEW */}
        <div
          className={`${tab === "preview" ? "block" : "hidden"} lg:block lg:flex-1 lg:h-[calc(100vh-140px)] lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4`}
        >
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2 w-full max-w-[1100px] mx-auto">
            <div className="flex gap-1.5 flex-wrap">
              {[
                "classic",
                "modern",
                "professional",
                "standard",
                "minimal",
                "elegant",
                "compact",
                "executive",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition ${template === t ? "bg-ink text-white border-ink" : "bg-white text-ink2 border-line hover:bg-paper"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <DownloadBtn
                onClick={exportPDF}
                icon={Download}
                label="PDF"
                primary
              />
              <DownloadBtn
                onClick={() => exportWord(previewData.name)}
                icon={FileText}
                label="Word"
              />
            </div>
          </div>
          <div className="w-full max-w-[1100px] mx-auto">
            <ResumePreview r={previewData} template={template} />
          </div>
        </div>
      </div>

      {(reviewing || review !== null) && (
        <div
          onClick={() => !reviewing && setReview(null)}
          className="fixed inset-0 z-50 grid place-items-center p-5"
          style={{ background: "rgba(0,0,0,.45)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-auto p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <ClipboardCheck size={20} className="text-brand" /> AI Resume
                Review
              </h3>
              <button onClick={() => setReview(null)} disabled={reviewing}>
                <X size={20} className="text-ink2" />
              </button>
            </div>
            {reviewing ? (
              <div className="flex items-center gap-2 text-ink2 py-6">
                <Loader2 size={18} className="animate-spin" /> Analysing your
                resume…
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink2">
                {review}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
