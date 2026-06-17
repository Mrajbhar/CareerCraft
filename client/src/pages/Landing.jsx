// ===> place at: client/src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  FileDown,
  Brain,
  LayoutTemplate,
  ArrowRight,
  Check,
  ClipboardCheck,
  Code2,
  Zap,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ResumeStyles, ResumeRender } from "../components/ResumeTemplates";

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
    "Full-stack developer with 3+ years building scalable web apps with React and Node.js. Focused on clean UI and shipping fast.",
  experience: [
    {
      id: 1,
      role: "Software Engineer",
      company: "TechNova",
      location: "Mumbai",
      period: "2022 — Present",
      bullets:
        "Built 12+ React features used by 40k monthly users\nReduced API latency 35% with Redis caching",
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
  projects: [],
  skillGroups: [
    {
      id: 1,
      category: "Skills",
      items: "React, Node.js, TypeScript, MongoDB, AWS, Docker",
    },
  ],
};

const features = [
  {
    icon: Sparkles,
    title: "AI writing & review",
    text: "Generate a sharp summary, polish your bullet points, get recruiter-style feedback, and draft a tailored cover letter — all AI-powered.",
    color: "#15634f",
  },
  {
    icon: ClipboardCheck,
    title: "ATS checker & job match",
    text: "Upload any resume for an instant ATS score, or match it against a job description to spot missing keywords.",
    color: "#2dd4bf",
  },
  {
    icon: LayoutTemplate,
    title: "10 professional templates",
    text: "Classic, Modern, Professional, Standard, Minimal, Elegant, Compact, Executive plus premium Aurora & Onyx — with font, size and accent-colour controls.",
    color: "#c6692f",
  },
  {
    icon: FileDown,
    title: "PDF & Word export",
    text: "Download a clean, recruiter-ready file in either format, exactly as previewed.",
    color: "#15634f",
  },
  {
    icon: Code2,
    title: "Built-in code compiler",
    text: "Practice coding in 7 languages right in the browser — no setup, with syntax colors.",
    color: "#d4a23a",
  },
  {
    icon: Brain,
    title: "Interview prep",
    text: "DSA patterns, behavioral questions and system-design drills, all in one studio.",
    color: "#b3402b",
  },
];

const skills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "AWS",
  "Docker",
  "MongoDB",
  "GraphQL",
  "Kubernetes",
];

/* reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(26px)",
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* count-up that starts when scrolled into view */
function CountUp({ to, suffix = "", ms = 1300 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf,
      done = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done) {
          done = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / ms);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, ms]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const start = () => nav(user ? "/dashboard" : "/login");

  return (
    <div className="text-ink overflow-hidden">
      <ResumeStyles />
      <style>{`
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes aurora{0%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.15)}100%{transform:translate(0,0) scale(1)}}
        @keyframes aurora2{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,25px) scale(1.1)}100%{transform:translate(0,0) scale(1)}}
        @keyframes gradPan{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        .fu{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
        .grad-text{background:linear-gradient(100deg,#15634f,#1a7a61,#c6692f,#15634f);background-size:240% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gradPan 7s ease infinite}
      `}</style>

      {/* hero */}
      <section className="relative">
        {/* aurora blobs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute -top-24 -left-16 w-[34rem] h-[34rem] rounded-full"
            style={{
              background: "radial-gradient(circle,#15634f33,transparent 60%)",
              filter: "blur(40px)",
              animation: "aurora 14s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-10 -right-24 w-[30rem] h-[30rem] rounded-full"
            style={{
              background: "radial-gradient(circle,#c6692f2e,transparent 60%)",
              filter: "blur(50px)",
              animation: "aurora2 16s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span
                className="fu inline-flex items-center gap-1.5 text-sm font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full"
                style={{ animationDelay: "0ms" }}
              >
                <Sparkles size={14} /> AI resume builder + interview studio
              </span>
              <h1
                className="fu font-display font-semibold leading-[1.04] text-4xl sm:text-5xl lg:text-[3.4rem] mt-5 mb-4"
                style={{ animationDelay: "90ms" }}
              >
                Build a resume that{" "}
                <span className="grad-text">gets you hired.</span>
              </h1>
              <p
                className="fu text-lg leading-relaxed text-ink2 max-w-md mb-7"
                style={{ animationDelay: "180ms" }}
              >
                Create a polished, ATS-friendly resume in minutes with
                AI-written content and live templates, check its ATS score, then
                sharpen your skills with built-in interview prep and a code
                compiler.
              </p>
              <div
                className="fu flex flex-wrap gap-3"
                style={{ animationDelay: "270ms" }}
              >
                <button
                  onClick={start}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rust text-white text-base font-semibold shadow-lg shadow-rust/20 hover:shadow-xl hover:shadow-rust/30 hover:-translate-y-0.5 transition-all"
                >
                  Create your resume{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                {!user && (
                  <button
                    onClick={() => nav("/login")}
                    className="px-5 py-3.5 rounded-xl border border-line bg-white text-base font-semibold hover:bg-paper hover:-translate-y-0.5 transition-all"
                  >
                    Log in
                  </button>
                )}
              </div>
              <div
                className="fu flex flex-wrap gap-4 mt-6 text-sm text-ink2"
                style={{ animationDelay: "360ms" }}
              >
                {[
                  "Free to start",
                  "No design skills needed",
                  "Export in seconds",
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <Check size={15} className="text-brand" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* resume mockup with glow + float */}
            <div className="relative h-[470px] hidden lg:block">
              <div
                className="absolute inset-6 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%,#15634f33,transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              <div
                className="absolute inset-0 origin-top"
                style={{ animation: "floatY 6s ease-in-out infinite" }}
              >
                <div className="scale-[0.82] -rotate-3 drop-shadow-2xl">
                  <ResumeRender r={sample} template="classic" />
                </div>
              </div>
              <span
                className="absolute top-2 right-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-brand px-3 py-1.5 rounded-full shadow-lg border border-line"
                style={{ animation: "floatY 5s ease-in-out infinite" }}
              >
                <Zap size={13} /> AI-written
              </span>
            </div>
          </div>
        </div>

        {/* scrolling skill marquee */}
        <div className="relative border-y border-line bg-card/60 py-3.5 overflow-hidden">
          <div
            className="flex gap-3 w-max"
            style={{ animation: "marquee 24s linear infinite" }}
          >
            {[...skills, ...skills].map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink2 bg-white border border-line rounded-full px-4 py-1.5"
              >
                <Star size={12} className="text-brand" /> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["10", 10, "", "Templates"],
            ["7", 7, "", "Compiler languages"],
            ["75", 75, "+", "DSA problems"],
            ["100", 100, "%", "Free to start"],
          ].map(([_, to, suffix, label], i) => (
            <Reveal
              key={label}
              delay={i * 80}
              className="rounded-2xl border border-line bg-card p-5 text-center hover:shadow-md transition"
            >
              <div className="font-display text-3xl sm:text-4xl font-semibold text-brand">
                <CountUp to={to} suffix={suffix} />
              </div>
              <div className="text-xs sm:text-sm text-ink2 mt-1">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <Reveal className="text-center mb-9">
          <h2 className="font-display text-3xl font-semibold">
            Everything you need to land the interview
          </h2>
          <p className="text-ink2 mt-2">
            From a standout resume to the prep that gets you through the door.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div
                className="group h-full rounded-2xl border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1.5"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 22px 48px -18px ${f.color}66`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  className="grid place-items-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: f.color + "1a" }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink2">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="bg-card border-y border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <Reveal className="text-center mb-9">
            <h2 className="font-display text-3xl font-semibold">
              Three steps to a job-ready resume
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              [
                "1",
                "Fill in your details",
                "Use the guided editor — AI helps write your summary and bullet points as you go.",
              ],
              [
                "2",
                "Pick a template & check it",
                "Switch templates live, watch your resume score climb, and run the ATS check.",
              ],
              [
                "3",
                "Export & prepare",
                "Download as PDF or Word, then practice DSA, behavioral and system-design questions.",
              ],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 120} className="text-center">
                <div className="mx-auto w-12 h-12 grid place-items-center rounded-2xl bg-brand text-white font-display text-xl font-semibold mb-4">
                  {n}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5">
                  {t}
                </h3>
                <p className="text-sm text-ink2 leading-relaxed max-w-xs mx-auto">
                  {d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* template showcase */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <Reveal className="text-center mb-9">
          <h2 className="font-display text-3xl font-semibold">
            One resume, every style
          </h2>
          <p className="text-ink2 mt-2 max-w-lg mx-auto">
            Switch between 10 polished templates instantly — your content stays,
            only the look changes.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { key: "classic", label: "Classic" },
            { key: "modern", label: "Modern" },
            { key: "professional", label: "Professional" },
          ].map((t, i) => (
            <Reveal key={t.key} delay={i * 110}>
              <div
                className="group rounded-2xl border border-line bg-card p-4 hover:-translate-y-1.5 transition-all duration-300"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 26px 54px -20px rgba(24,168,132,.5)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  className="relative mx-auto overflow-hidden rounded-xl border border-line bg-white"
                  style={{ width: 336, height: 384, maxWidth: "100%" }}
                >
                  <div
                    style={{
                      width: 800,
                      transform: "scale(0.42)",
                      transformOrigin: "top left",
                      pointerEvents: "none",
                    }}
                  >
                    <ResumeRender r={sample} template={t.key} />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,.06))",
                    }}
                  />
                </div>
                <div className="text-center mt-3 font-display font-semibold capitalize group-hover:text-brand transition-colors">
                  {t.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center mt-10">
          <button
            onClick={start}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand text-white text-base font-bold shadow-lg shadow-brand/25 hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Build yours free{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </Reveal>
      </section>
    </div>
  );
}
