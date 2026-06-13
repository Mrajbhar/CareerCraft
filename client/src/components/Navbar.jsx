
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Layers, LayoutDashboard, LogOut, Brain, ClipboardCheck, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/prep", label: "Interview Prep", icon: Brain },
  { to: "/checker", label: "Resume Checker", icon: ClipboardCheck },
];

function Avatar({ user, size = 34 }) {
  const initial = (user?.name || "?").trim()[0]?.toUpperCase() || "?";
  return user?.avatar
    ? <img src={user.avatar} alt="" className="rounded-full object-cover ring-2 ring-white/15" style={{ width: size, height: size }} />
    : <span className="grid place-items-center rounded-full text-white font-semibold ring-2 ring-white/15" style={{ width: size, height: size, fontSize: size * 0.42, background: "linear-gradient(135deg,#18a884,#0f8163)" }}>{initial}</span>;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // sliding highlight pill
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const [over, setOver] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0, show: false });

  const activeTo = NAV.find((n) => pathname.startsWith(n.to))?.to;
  const currentTo = over || activeTo;

  const moveTo = (to) => {
    const el = itemRefs.current[to], c = navRef.current;
    if (!el || !c) { setPill((p) => ({ ...p, show: false })); return; }
    const cr = c.getBoundingClientRect(), r = el.getBoundingClientRect();
    setPill({ left: r.left - cr.left, width: r.width, show: true });
  };

  useLayoutEffect(() => { moveTo(currentTo); }, [currentTo, user]);
  useEffect(() => {
    const onResize = () => moveTo(currentTo);
    window.addEventListener("resize", onResize);
    const t = setTimeout(() => moveTo(currentTo), 350);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t); };
  }, [currentTo]);

  useEffect(() => { setOpen(false); setProfileOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const doLogout = () => { logout(); nav("/"); };
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className={`no-print sticky top-0 z-30 bg-card/80 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)]" : ""}`}>
      {/* gradient hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(24,168,132,.5), rgba(45,212,191,.4), transparent)" }} />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* logo */}
        <NavLink to="/" className="group flex items-center gap-2.5 text-ink no-underline">
          <span className="relative grid place-items-center w-9 h-9 rounded-xl text-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 shadow-lg shadow-brand/30"
            style={{ background: "linear-gradient(135deg,#18a884,#0f8163)" }}>
            <Layers size={19} />
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
          </span>
          <span className="font-display text-xl tracking-tight font-semibold">Career<span className="text-brand">Craft</span></span>
        </NavLink>

        {user ? (
          <>
            {/* desktop */}
            <div className="hidden md:flex items-center gap-3">
              <nav ref={navRef} onMouseLeave={() => setOver(null)}
                className="relative flex items-center gap-1 rounded-xl border border-line bg-paper/60 p-1">
                <span className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out shadow-lg shadow-brand/30"
                  style={{ left: pill.left, width: pill.width, opacity: pill.show ? 1 : 0, background: "linear-gradient(135deg,#18a884,#15917a)" }} />
                {NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} ref={(el) => (itemRefs.current[to] = el)} onMouseEnter={() => setOver(to)}
                    className={`relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${currentTo === to ? "text-white" : "text-ink2 hover:text-ink"}`}>
                    <Icon size={16} /> {label}
                  </NavLink>
                ))}
              </nav>

              {/* profile menu */}
              <div className="relative">
                <button onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-line bg-paper/60 hover:bg-paper transition-colors">
                  <Avatar user={user} />
                  <span className="text-sm font-semibold text-ink hidden lg:inline">{firstName}</span>
                  <ChevronDown size={15} className="text-ink2 transition-transform" style={{ transform: profileOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 z-20 rounded-2xl border border-line bg-card shadow-2xl overflow-hidden" style={{ animation: "navMenu .18s ease both" }}>
                      <div className="flex items-center gap-3 p-3.5 border-b border-line">
                        <Avatar user={user} size={42} />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{user.name}</div>
                          {user.email && <div className="text-xs text-ink2 truncate">{user.email}</div>}
                        </div>
                      </div>
                      <div className="p-1.5">
                        <button onClick={() => nav("/dashboard")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-ink2 hover:text-ink hover:bg-paper transition-colors">
                          <LayoutDashboard size={16} /> Dashboard
                        </button>
                        <button onClick={doLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-rust hover:bg-rust/10 transition-colors">
                          <LogOut size={16} /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* mobile toggle */}
            <button onClick={() => setOpen((v) => !v)} className="md:hidden grid place-items-center w-10 h-10 rounded-lg border border-line bg-white active:scale-95 transition" aria-label="Menu">
              <span className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-50" : "opacity-100"}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-300 ${open ? "opacity-100" : "opacity-0 -rotate-90 scale-50"}`} />
              </span>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-2">
            <button onClick={() => nav("/login")} className="px-3.5 py-2 text-sm font-semibold text-ink2 hover:text-ink transition-colors">Log in</button>
            <button onClick={() => nav("/signup")}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-lg shadow-brand/30 hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg,#18a884,#0f8163)" }}>
              Sign up
            </button>
          </nav>
        )}
      </div>

      {/* mobile dropdown */}
      {user && (
        <div className="md:hidden overflow-hidden transition-[grid-template-rows] duration-300" style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr" }}>
          <div className="overflow-hidden">
            <nav className="px-4 sm:px-6 pb-4 pt-3 flex flex-col gap-1.5 border-t border-line">
              <div className="flex items-center gap-3 px-1 pb-2">
                <Avatar user={user} size={40} />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{user.name}</div>
                  {user.email && <div className="text-xs text-ink2 truncate">{user.email}</div>}
                </div>
              </div>
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? "text-white" : "text-ink2 hover:bg-paper"}`}
                  style={({ isActive }) => isActive ? { background: "linear-gradient(135deg,#18a884,#15917a)" } : undefined}>
                  <Icon size={17} /> {label}
                </NavLink>
              ))}
              <button onClick={doLogout}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold border border-line bg-white text-rust hover:bg-rust/10 transition-colors mt-1">
                <LogOut size={16} /> Log out
              </button>
            </nav>
          </div>
        </div>
      )}
      <style>{`@keyframes navMenu{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </header>
  );
}