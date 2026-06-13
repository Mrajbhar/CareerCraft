import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Check, Type } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { ResumeStyles, ResumeRender } from "../components/ResumeTemplates";

// realistic sample so each format looks like a finished resume
const sample = {
  name: "Mohan Rajbhar",
  firstName: "Mohan",
  lastName: "Rajbhar",
  title: "Full-Stack Developer",
  email: "mohan@email.com",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  links: [
    { id: 1, label: "GitHub", url: "github.com/mohan" },
    { id: 2, label: "LinkedIn", url: "in/mohan" },
  ],
  summary:
    "Full-stack developer with 3+ years building scalable web apps with React and Node.js. Focused on clean UI, performance, and shipping fast.",
  experience: [
    {
      id: 1,
      role: "Software Engineer",
      company: "TechNova",
      location: "Mumbai",
      period: "2022 — Present",
      bullets:
        "Built 12+ React features used by 40k monthly users\nReduced API latency 35% with Redis caching\nMentored 3 junior developers",
    },
    {
      id: 2,
      role: "Frontend Intern",
      company: "Webify",
      location: "Remote",
      period: "2021 — 2022",
      bullets:
        "Shipped a component library used across 5 products\nImproved Lighthouse score from 68 to 96",
    },
  ],
  projects: [
    {
      id: 1,
      name: "CareerCraft",
      tech: "React, Node",
      link: "github.com/mohan/careercraft",
      desc: "AI resume builder with interview prep and an in-browser code compiler.",
    },
  ],
  education: [
    {
      id: 1,
      school: "University of Mumbai",
      degree: "B.E. Computer Engineering",
      period: "2018 — 2022",
      detail: "CGPA 8.4",
    },
  ],
  skillGroups: [
    {
      id: 1,
      category: "Languages",
      items: "JavaScript, TypeScript, Python, Java",
    },
    {
      id: 2,
      category: "Frameworks",
      items: "React, Node.js, Express, Next.js",
    },
  ],
  certifications: [
    { id: 1, name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
  ],
  achievements: [{ id: 1, text: "Winner, Smart India Hackathon 2022" }],
  custom: [],
  preferences: { remote: true, relocate: true },
};

const TEMPLATES = [
  {
    key: "classic",
    label: "Classic",
    font: "Fraunces",
    desc: "Centered header, single column, ATS-friendly.",
  },
  {
    key: "modern",
    label: "Modern",
    font: "Poppins",
    desc: "Emerald sidebar with contact, skills & education.",
  },
  {
    key: "professional",
    label: "Professional",
    font: "Lora",
    desc: "Bold name, clean rules, blue accents.",
  },
  {
    key: "standard",
    label: "Standard",
    font: "Georgia",
    desc: "Centered classic layout with neat separators.",
  },
  {
    key: "minimal",
    label: "Minimal",
    font: "Inter",
    desc: "Airy sans-serif with lots of whitespace.",
  },
  {
    key: "elegant",
    label: "Elegant",
    font: "Playfair Display",
    desc: "Centered serif with ruled section titles.",
  },
  {
    key: "compact",
    label: "Compact",
    font: "Lato",
    desc: "Dense layout that fits more on one page.",
  },
  {
    key: "executive",
    label: "Executive",
    font: "Charter",
    desc: "Serif with small-caps name & headings — matches a LaTeX-style corporate resume.",
  },
];

const PAGE_W = 780;
const FRAME_H = 360; // visible height of each thumbnail

function Thumb({ template }) {
  const wrap = useRef(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const measure = () => setScale((wrap.current?.clientWidth || 300) / PAGE_W);
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={wrap}
      style={{
        width: "100%",
        height: FRAME_H,
        overflow: "hidden",
        position: "relative",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: PAGE_W,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      >
        <ResumeRender r={sample} template={template} />
      </div>
      {/* fade so the cut-off looks intentional */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          background: "linear-gradient(transparent, #fff)",
        }}
      />
    </div>
  );
}

export default function Templates() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");

  const useTemplate = async (key) => {
    if (!user) {
      nav("/login");
      return;
    }
    setErr("");
    setBusy(key);
    try {
      const res = await api.post("/resumes", {
        title: "Untitled Resume",
        template: key,
        data: {},
      });
      const newId = res.data?._id || res.data?.id;
      if (!newId) throw new Error("no id");
      nav(`/builder/${newId}`);
    } catch (e) {
      setErr("Could not create the resume. Please try again.");
      setBusy(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <ResumeStyles />
      <style>{`@keyframes tIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>

      {/* header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full">
          <Type size={14} /> {TEMPLATES.length} resume formats
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-4">
          Pick a template you love
        </h1>
        <p className="text-ink2 mt-2">
          Each format has its own layout and font. Choose one and we'll open it
          in the builder, ready for you to fill in.
        </p>
      </div>

      {err && (
        <div className="max-w-md mx-auto mb-6 text-rust text-sm bg-rust/10 border border-rust/20 rounded-lg px-3 py-2 text-center">
          {err}
        </div>
      )}

      {/* gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TEMPLATES.map((t, i) => (
          <div
            key={t.key}
            className="group rounded-2xl border border-line bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            style={{
              animation: `tIn .5s cubic-bezier(.22,1,.36,1) both`,
              animationDelay: `${(i % 3) * 80}ms`,
            }}
          >
            {/* clickable preview */}
            <button
              onClick={() => useTemplate(t.key)}
              className="block w-full text-left relative"
            >
              <div className="m-3 rounded-xl overflow-hidden border border-line shadow-sm">
                <Thumb template={t.key} />
              </div>
              {/* hover overlay */}
              <div
                className="absolute inset-3 rounded-xl grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(11,14,20,.55)" }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold shadow-lg">
                  Use this template <ArrowRight size={16} />
                </span>
              </div>
            </button>

            {/* meta + button */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {t.label}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink2 bg-paper border border-line rounded-full px-2 py-0.5">
                  <Type size={11} /> {t.font}
                </span>
              </div>
              <p className="text-sm text-ink2 mt-1 mb-3 leading-snug">
                {t.desc}
              </p>
              <button
                onClick={() => useTemplate(t.key)}
                disabled={busy === t.key}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-60"
              >
                {busy === t.key ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Creating…
                  </>
                ) : (
                  <>
                    Use this template <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-ink2 mt-8">
        You can switch templates anytime inside the builder — your content stays
        the same.
      </p>
    </div>
  );
}
