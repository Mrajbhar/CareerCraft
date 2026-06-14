import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Wand2, Loader2, ChevronDown } from "lucide-react";

const inputStyle = {
  width: "100%", marginTop: 5, padding: "9px 11px",
  border: "1px solid var(--color-line)", borderRadius: 9, background: "rgba(255,255,255,.05)",
  fontSize: 14, color: "var(--color-ink)", resize: "vertical", lineHeight: 1.5,
  fontFamily: "inherit", boxSizing: "border-box",
};

export const Field = ({ label, value, onChange, placeholder, area }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    {label && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>{label}</span>}
    {area ? (
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} style={inputStyle} />
    ) : (
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    )}
  </label>
);


export const Select = ({ value, onChange, options = [], placeholder = "Select…", theme = "dark", width }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);
  const dark = theme === "dark";
  const panelBg = dark ? "#141a26" : "#ffffff";
  const txt = dark ? "#e8ebf1" : "#11151c";
  const subTxt = dark ? "#99a2b3" : "#5b6472";
  const border = dark ? "rgba(255,255,255,.16)" : "#e6ddcc";
  const hover = dark ? "rgba(255,255,255,.08)" : "#f1ede3";
  const activeBg = dark ? "rgba(45,212,191,.16)" : "rgba(21,99,79,.10)";
  const activeTx = dark ? "#2dd4bf" : "#15634f";
  const sel = options.find((o) => o.value === value);
  return (
    <div ref={ref} style={{ position: "relative", width: width || "auto", display: width ? "block" : "inline-block" }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          width: width ? "100%" : "auto", padding: "8px 11px", border: `1px solid ${border}`,
          borderRadius: 9, background: panelBg, color: sel ? txt : subTxt, fontSize: 13,
          fontWeight: 600, fontFamily: "inherit", cursor: "pointer", lineHeight: 1.2, boxSizing: "border-box",
        }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel ? sel.label : placeholder}</span>
        <ChevronDown size={15} style={{ flexShrink: 0, opacity: 0.7, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%", maxHeight: 280,
          overflowY: "auto", zIndex: 70, background: panelBg, border: `1px solid ${border}`,
          borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.30)", padding: 4,
        }}>
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button key={o.value || "default"} type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hover; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 7,
                  border: "none", background: active ? activeBg : "transparent",
                  color: active ? activeTx : txt, fontSize: 13, fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Phone number with a country-code dropdown
const COUNTRY_CODES = [
  { code: "+91", name: "India" }, { code: "+1", name: "USA/Canada" }, { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" }, { code: "+971", name: "UAE" }, { code: "+65", name: "Singapore" },
  { code: "+49", name: "Germany" }, { code: "+33", name: "France" }, { code: "+81", name: "Japan" },
  { code: "+86", name: "China" }, { code: "+92", name: "Pakistan" }, { code: "+880", name: "Bangladesh" },
  { code: "+977", name: "Nepal" }, { code: "+94", name: "Sri Lanka" }, { code: "+966", name: "Saudi Arabia" },
  { code: "+60", name: "Malaysia" }, { code: "+27", name: "South Africa" }, { code: "+31", name: "Netherlands" },
  { code: "+39", name: "Italy" }, { code: "+34", name: "Spain" }, { code: "+7", name: "Russia" },
  { code: "+82", name: "South Korea" }, { code: "+55", name: "Brazil" }, { code: "+64", name: "New Zealand" },
  { code: "+353", name: "Ireland" }, { code: "+852", name: "Hong Kong" },
];
export const PhoneField = ({ code, number, onCode, onNumber }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>Phone Number</span>
    <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
      <div style={{ flexShrink: 0 }}>
        <Select theme="dark" width={142} value={code || ""} onChange={onCode}
          options={[{ value: "", label: "Code" }, ...COUNTRY_CODES.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }))]} />
      </div>
      <input value={number || ""} onChange={(e) => onNumber(e.target.value)} placeholder="Phone number" style={{ ...inputStyle, marginTop: 0 }} />
    </div>
  </label>
);

// From / To month pickers with a "Present" toggle. Reports raw values via onPatch.
export const DateRange = ({ from, to, current, label = "Duration", onPatch }) => (
  <div style={{ marginBottom: 12 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>{label}</span>
    <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
      <input type="month" value={from || ""} onChange={(e) => onPatch({ from: e.target.value })}
        aria-label="From" style={{ ...inputStyle, marginTop: 0, colorScheme: "dark", flex: "1 1 120px", minWidth: 120 }} />
      <span style={{ color: "var(--color-ink2)", fontSize: 13 }}>to</span>
      <input type="month" value={current ? "" : (to || "")} disabled={current} onChange={(e) => onPatch({ to: e.target.value })}
        aria-label="To" style={{ ...inputStyle, marginTop: 0, colorScheme: "dark", flex: "1 1 120px", minWidth: 120, opacity: current ? 0.45 : 1 }} />
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-ink2)", cursor: "pointer", whiteSpace: "nowrap" }}>
        <input type="checkbox" checked={!!current} onChange={(e) => onPatch({ current: e.target.checked })}
          style={{ accentColor: "var(--color-brand)", width: 15, height: 15 }} />
        Present
      </label>
    </div>
  </div>
);

export const Section = ({ icon: Icon, title, action, children }) => (
  <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--color-line)", borderRadius: 14, padding: 18, marginBottom: 16, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {Icon && <Icon size={18} color="var(--color-brand)" />}
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: "Georgia, serif", color: "var(--color-ink)" }}>{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

export const AiBtn = ({ onClick, loading, label }) => (
  <button onClick={onClick} disabled={loading}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
      border: "none", borderRadius: 8, background: loading ? "rgba(255,255,255,.12)" : "var(--color-brand)",
      color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: loading ? "default" : "pointer" }}>
    {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Wand2 size={14} />}
    {label}
  </button>
);

export const AddBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px",
      borderRadius: 8, border: "1px dashed var(--color-brand)", background: "transparent",
      color: "var(--color-brand)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
    <Plus size={14} /> Add
  </button>
);

export const Card = ({ children, onDel }) => (
  <div style={{ position: "relative", border: "1px solid var(--color-line)", borderRadius: 11, padding: 14, marginBottom: 12, background: "rgba(255,255,255,.04)", animation: "cardIn .28s ease both" }}>
    <button onClick={onDel} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", cursor: "pointer" }}>
      <Trash2 size={15} color="var(--color-rust)" />
    </button>
    {children}
  </div>
);

export const DownloadBtn = ({ onClick, icon: Icon, label, primary }) => (
  <button onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 15px",
      borderRadius: 9, border: primary ? "none" : "1px solid var(--color-line)", cursor: "pointer",
      fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
      background: primary ? "var(--color-rust)" : "rgba(255,255,255,.06)", color: primary ? "#fff" : "var(--color-ink)" }}>
    {Icon && <Icon size={16} />} {label}
  </button>
);

export const BulletEditor = ({ value, onChange, label }) => {
  const arr = (value || "").split("\n");
  const list = arr.length ? arr : [""];
  const setAt = (i, v) => { const n = [...list]; n[i] = v; onChange(n.join("\n")); };
  const addBullet = () => onChange([...list, ""].join("\n"));
  const removeAt = (i) => { const n = list.filter((_, j) => j !== i); onChange((n.length ? n : [""]).join("\n")); };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>{label}</span>}
      <div style={{ marginTop: 5, display: "flex", flexDirection: "column", gap: 6 }}>
        {list.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: "var(--color-brand)", fontWeight: 700 }}>•</span>
            <input value={b} onChange={(e) => setAt(i, e.target.value)} placeholder="Describe an achievement…"
              style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: "var(--color-ink)", background: "rgba(255,255,255,.05)" }} />
            <button onClick={() => removeAt(i)} title="Remove bullet"
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-rust)", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
        ))}
      </div>
      <button onClick={addBullet}
        style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--color-brand)", background: "transparent", border: "1px dashed var(--color-brand)", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
        + Add bullet
      </button>
    </div>
  );
};