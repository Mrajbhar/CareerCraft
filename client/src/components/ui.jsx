import { Plus, Trash2, Wand2, Loader2 } from "lucide-react";

const inputStyle = {
  width: "100%",
  marginTop: 5,
  padding: "9px 11px",
  border: "1px solid var(--color-line)",
  borderRadius: 9,
  background: "rgba(255,255,255,.05)",
  fontSize: 14,
  color: "var(--color-ink)",
  resize: "vertical",
  lineHeight: 1.5,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export const Field = ({ label, value, onChange, placeholder, area }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    {label && (
      <span
        style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}
      >
        {label}
      </span>
    )}
    {area ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={inputStyle}
      />
    ) : (
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    )}
  </label>
);

// Phone number with a country-code dropdown
const COUNTRY_CODES = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA/Canada" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+971", name: "UAE" },
  { code: "+65", name: "Singapore" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+92", name: "Pakistan" },
  { code: "+880", name: "Bangladesh" },
  { code: "+977", name: "Nepal" },
  { code: "+94", name: "Sri Lanka" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+60", name: "Malaysia" },
  { code: "+27", name: "South Africa" },
  { code: "+31", name: "Netherlands" },
  { code: "+39", name: "Italy" },
  { code: "+34", name: "Spain" },
  { code: "+7", name: "Russia" },
  { code: "+82", name: "South Korea" },
  { code: "+55", name: "Brazil" },
  { code: "+64", name: "New Zealand" },
  { code: "+353", name: "Ireland" },
  { code: "+852", name: "Hong Kong" },
];
export const PhoneField = ({ code, number, onCode, onNumber }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>
      Phone Number
    </span>
    <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
      <select
        value={code || ""}
        onChange={(e) => onCode(e.target.value)}
        style={{
          ...inputStyle,
          marginTop: 0,
          width: 132,
          flexShrink: 0,
          cursor: "pointer",
          colorScheme: "dark",
        }}
      >
        <option value="">Code</option>
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
      <input
        value={number || ""}
        onChange={(e) => onNumber(e.target.value)}
        placeholder="Phone number"
        style={{ ...inputStyle, marginTop: 0 }}
      />
    </div>
  </label>
);

// From / To month pickers with a "Present" toggle. Reports raw values via onPatch.
export const DateRange = ({
  from,
  to,
  current,
  label = "Duration",
  onPatch,
}) => (
  <div style={{ marginBottom: 12 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}>
      {label}
    </span>
    <div
      style={{
        display: "flex",
        gap: 8,
        marginTop: 5,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        type="month"
        value={from || ""}
        onChange={(e) => onPatch({ from: e.target.value })}
        aria-label="From"
        style={{
          ...inputStyle,
          marginTop: 0,
          colorScheme: "dark",
          flex: "1 1 120px",
          minWidth: 120,
        }}
      />
      <span style={{ color: "var(--color-ink2)", fontSize: 13 }}>to</span>
      <input
        type="month"
        value={current ? "" : to || ""}
        disabled={current}
        onChange={(e) => onPatch({ to: e.target.value })}
        aria-label="To"
        style={{
          ...inputStyle,
          marginTop: 0,
          colorScheme: "dark",
          flex: "1 1 120px",
          minWidth: 120,
          opacity: current ? 0.45 : 1,
        }}
      />
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--color-ink2)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <input
          type="checkbox"
          checked={!!current}
          onChange={(e) => onPatch({ current: e.target.checked })}
          style={{ accentColor: "var(--color-brand)", width: 15, height: 15 }}
        />
        Present
      </label>
    </div>
  </div>
);

export const Section = ({ icon: Icon, title, action, children }) => (
  <div
    style={{
      background: "rgba(255,255,255,.05)",
      border: "1px solid var(--color-line)",
      borderRadius: 14,
      padding: 18,
      marginBottom: 16,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {Icon && <Icon size={18} color="var(--color-brand)" />}
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "Georgia, serif",
            color: "var(--color-ink)",
          }}
        >
          {title}
        </h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

export const AiBtn = ({ onClick, loading, label }) => (
  <button
    onClick={onClick}
    disabled={loading}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      border: "none",
      borderRadius: 8,
      background: loading ? "rgba(255,255,255,.12)" : "var(--color-brand)",
      color: "#fff",
      fontSize: 12.5,
      fontWeight: 600,
      cursor: loading ? "default" : "pointer",
    }}
  >
    {loading ? (
      <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
    ) : (
      <Wand2 size={14} />
    )}
    {label}
  </button>
);

export const AddBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "6px 11px",
      borderRadius: 8,
      border: "1px dashed var(--color-brand)",
      background: "transparent",
      color: "var(--color-brand)",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    <Plus size={14} /> Add
  </button>
);

export const Card = ({ children, onDel }) => (
  <div
    style={{
      position: "relative",
      border: "1px solid var(--color-line)",
      borderRadius: 11,
      padding: 14,
      marginBottom: 12,
      background: "rgba(255,255,255,.04)",
      animation: "cardIn .28s ease both",
    }}
  >
    <button
      onClick={onDel}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <Trash2 size={15} color="var(--color-rust)" />
    </button>
    {children}
  </div>
);

export const DownloadBtn = ({ onClick, icon: Icon, label, primary }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "9px 15px",
      borderRadius: 9,
      border: primary ? "none" : "1px solid var(--color-line)",
      cursor: "pointer",
      fontSize: 13.5,
      fontWeight: 600,
      fontFamily: "inherit",
      background: primary ? "var(--color-rust)" : "rgba(255,255,255,.06)",
      color: primary ? "#fff" : "var(--color-ink)",
    }}
  >
    {Icon && <Icon size={16} />} {label}
  </button>
);

export const BulletEditor = ({ value, onChange, label }) => {
  const arr = (value || "").split("\n");
  const list = arr.length ? arr : [""];
  const setAt = (i, v) => {
    const n = [...list];
    n[i] = v;
    onChange(n.join("\n"));
  };
  const addBullet = () => onChange([...list, ""].join("\n"));
  const removeAt = (i) => {
    const n = list.filter((_, j) => j !== i);
    onChange((n.length ? n : [""]).join("\n"));
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <span
          style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink2)" }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {list.map((b, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 6, alignItems: "center" }}
          >
            <span style={{ color: "var(--color-brand)", fontWeight: 700 }}>
              •
            </span>
            <input
              value={b}
              onChange={(e) => setAt(i, e.target.value)}
              placeholder="Describe an achievement…"
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                color: "var(--color-ink)",
                background: "rgba(255,255,255,.05)",
              }}
            />
            <button
              onClick={() => removeAt(i)}
              title="Remove bullet"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--color-rust)",
                fontSize: 20,
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addBullet}
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12.5,
          fontWeight: 600,
          color: "var(--color-brand)",
          background: "transparent",
          border: "1px dashed var(--color-brand)",
          borderRadius: 8,
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        + Add bullet
      </button>
    </div>
  );
};
