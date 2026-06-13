
import { NavLink } from "react-router-dom";
import { Layers, Code2, Briefcase, Mail, ArrowUp } from "lucide-react";

/* link with a sliding underline on hover */
function FLink({ to, href, children }) {
  const cls = "group relative inline-flex items-center text-ink2 hover:text-ink transition-colors text-sm w-fit";
  const underline = <span className="pointer-events-none absolute left-0 -bottom-0.5 h-px bg-brand w-0 group-hover:w-full transition-all duration-300" />;
  return href
    ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}{underline}</a>
    : <NavLink to={to} className={cls}>{children}{underline}</NavLink>;
}

const Social = ({ href, label, children }) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label} title={label}
    className="grid place-items-center w-9 h-9 rounded-lg border border-line text-ink2 hover:text-white hover:bg-brand hover:border-brand hover:-translate-y-0.5 hover:scale-105 transition-all">
    {children}
  </a>
);

export default function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="no-print relative overflow-hidden border-t border-line bg-card mt-auto">
      <style>{`@keyframes footUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
      {/* gradient accent line + soft glow */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #18a884aa, #e0743a88, #2dd4bf88, transparent)" }} />
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(24,168,132,.18), transparent 65%)", filter: "blur(50px)" }} />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12" style={{ animation: "footUp .6s cubic-bezier(.22,1,.36,1) both" }}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-1">
            <div className="group flex items-center gap-2.5 mb-3 w-fit">
              <span className="grid place-items-center w-9 h-9 rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6"
                style={{ background: "linear-gradient(135deg,#18a884,#0f8163)" }}>
                <Layers size={19} />
              </span>
              <strong className="font-display text-xl text-ink">Career<span className="text-brand">Craft</span></strong>
            </div>
            <p className="text-ink2 text-sm leading-relaxed max-w-xs">
              Build a polished, ATS-friendly resume in minutes — then sharpen your interview skills, all in one place.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <Social href="https://github.com" label="GitHub"><Code2 size={17} /></Social>
              <Social href="https://linkedin.com" label="LinkedIn"><Briefcase size={17} /></Social>
              <Social href="mailto:hello@careercraft.app" label="Email"><Mail size={17} /></Social>
            </div>
          </div>

          {/* product */}
          <div>
            <h4 className="font-semibold text-ink mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="flex flex-col gap-2.5">
              <li><FLink to="/dashboard">Dashboard</FLink></li>
              <li><FLink to="/prep">Interview Prep</FLink></li>
              <li><FLink to="/checker">Resume Checker</FLink></li>
            </ul>
          </div>

          {/* resources */}
          <div>
            <h4 className="font-semibold text-ink mb-3 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-2.5">
              <li><FLink to="/">Home</FLink></li>
              <li><FLink href="https://leetcode.com">Practice Problems</FLink></li>
              <li><FLink href="https://roadmap.sh">Career Roadmaps</FLink></li>
            </ul>
          </div>

          {/* back to top */}
          <div className="flex flex-col items-start sm:items-end justify-between gap-4">
            <button onClick={toTop}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-sm font-semibold text-ink2 hover:text-ink hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Back to top
            </button>
            <span className="text-xs text-ink2">Made for job seekers, by job seekers.</span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ink2 text-xs">© {year} CareerCraft. All rights reserved.</p>
          <p className="text-ink2 text-xs">Built with React, Node &amp; MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}