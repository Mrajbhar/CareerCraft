import { useEffect, useState, useRef } from "react";
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";

const lines = (s) => (s || "").split("\n").filter((x) => x.trim());
const items = (s) =>
  (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const loc = (r) =>
  r.location || [r.city, r.state, r.country].filter(Boolean).join(", ");
const C = {
  ink: "#1b1a17",
  soft: "#3a382f",
  mute: "#8a8678",
  brand: "#15634f",
  line: "#e6ddcc",
};

export function ResumeStyles() {
  useEffect(() => {
    if (document.getElementById("careercraft-styles")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Lato:wght@400;700&family=Playfair+Display:wght@500;600;700&family=Poppins:wght@400;500;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = "careercraft-styles";
    style.textContent = `
      @keyframes spin{to{transform:rotate(360deg)}}
      #resume-paper{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      @media print{
        body * { visibility:hidden !important; }
        #resume-paper, #resume-paper * { visibility:visible !important; }
        #resume-paper{ position:absolute; left:0; top:0; width:100%; box-shadow:none!important; }
        @page{ margin:14mm; }
      }`;
    document.head.appendChild(style);
  }, []);
  return null;
}

/* ---------- font (typography) options ---------- */
export const FONTS = [
  // Each font has a DISTINCT system fallback so templates look different even if Google Fonts fail to load.
  {
    id: "classic",
    label: "Fraunces",
    serif: "'Fraunces', 'Baskerville', Georgia, serif",
    sans: "'Hanken Grotesk', 'Segoe UI', sans-serif",
  },
  {
    id: "inter",
    label: "Inter",
    serif: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  {
    id: "lora",
    label: "Lora",
    serif: "'Lora', 'Times New Roman', Times, serif",
    sans: "'Lato', Tahoma, sans-serif",
  },
  {
    id: "playfair",
    label: "Playfair",
    serif: "'Playfair Display', 'Palatino Linotype', Palatino, serif",
    sans: "'Lato', Tahoma, sans-serif",
  },
  {
    id: "poppins",
    label: "Poppins",
    serif: "'Poppins', 'Trebuchet MS', sans-serif",
    sans: "'Poppins', 'Trebuchet MS', sans-serif",
  },
  {
    id: "georgia",
    label: "Georgia",
    serif: "Georgia, 'Times New Roman', serif",
    sans: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "lato",
    label: "Lato",
    serif: "'Lato', Verdana, Geneva, sans-serif",
    sans: "'Lato', Verdana, Geneva, sans-serif",
  },
  {
    id: "hanken",
    label: "Hanken",
    serif: "'Hanken Grotesk', Tahoma, Geneva, sans-serif",
    sans: "'Hanken Grotesk', Tahoma, Geneva, sans-serif",
  },
  {
    id: "ptserif",
    label: "Charter",
    serif:
      "Charter, 'Charter BT', 'PT Serif', Georgia, 'Times New Roman', serif",
    sans: "Charter, 'Charter BT', 'PT Serif', Georgia, 'Times New Roman', serif",
  },
];
const FONT_MAP = Object.fromEntries(FONTS.map((f) => [f.id, f]));
const fontVars = (r) => {
  const f = FONT_MAP[(r && r.font) || "classic"] || FONTS[0];
  return { "--rz-serif": f.serif, "--rz-sans": f.sans };
};

/* ---------- shared content blocks (used by both templates) ---------- */
const body = { fontFamily: "var(--rz-sans, 'Hanken Grotesk', sans-serif)" };
const serif = { fontFamily: "var(--rz-serif, 'Fraunces', Georgia, serif)" };

const Bullets = ({ text }) =>
  lines(text).length ? (
    <ul
      style={{
        ...body,
        margin: "4px 0 0",
        paddingLeft: 18,
        listStyleType: "disc",
        fontSize: 13,
        lineHeight: 1.55,
        color: C.soft,
      }}
    >
      {lines(text).map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  ) : null;

const ExperienceItem = ({ e }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <strong style={{ ...serif, fontSize: 14.5 }}>
        {e.role}
        {e.company && <span style={{ fontWeight: 400 }}> · {e.company}</span>}
      </strong>
      <span style={{ ...body, fontSize: 12, color: C.mute }}>{e.period}</span>
    </div>
    {e.location && (
      <div style={{ ...body, fontSize: 12, color: C.mute }}>{e.location}</div>
    )}
    <Bullets text={e.bullets} />
  </div>
);

const ProjectItem = ({ p }) => (
  <div style={{ marginBottom: 9, ...body }}>
    <span>
      <strong style={{ ...serif, fontSize: 14 }}>{p.name}</strong>
      {p.tech && (
        <span style={{ fontSize: 12, color: C.brand, marginLeft: 8 }}>
          {p.tech}
        </span>
      )}
      {p.link && (
        <span style={{ fontSize: 11.5, color: C.mute, marginLeft: 8 }}>
          {p.link}
        </span>
      )}
    </span>
    {p.desc && (
      <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.5 }}>
        {p.desc}
      </div>
    )}
  </div>
);

const EduItem = ({ e }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6,
      ...body,
      fontSize: 13,
    }}
  >
    <span>
      <strong style={serif}>{e.degree}</strong> — {e.school}{" "}
      {e.detail && <em style={{ color: C.mute }}>· {e.detail}</em>}
    </span>
    <span style={{ color: C.mute, fontSize: 12 }}>{e.period}</span>
  </div>
);

const CertItem = ({ c }) => (
  <div style={{ ...body, fontSize: 13, marginBottom: 4 }}>
    <strong style={serif}>{c.name}</strong>
    {c.issuer && ` — ${c.issuer}`}
    {c.year && <span style={{ color: C.mute }}> · {c.year}</span>}
  </div>
);

const SkillGroups = ({ groups }) => (
  <div style={body}>
    {groups.map((g) => (
      <div key={g.id} style={{ fontSize: 13, marginBottom: 4, color: C.soft }}>
        {g.category && <strong style={{ color: C.ink }}>{g.category}: </strong>}
        {g.items}
      </div>
    ))}
  </div>
);

const CustomItem = ({ it }) => (
  <div style={{ marginBottom: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <strong style={{ ...serif, fontSize: 14 }}>
        {it.heading}
        {it.subheading && (
          <span style={{ fontWeight: 400 }}> · {it.subheading}</span>
        )}
      </strong>
      {it.period && (
        <span style={{ ...body, fontSize: 12, color: C.mute }}>
          {it.period}
        </span>
      )}
    </div>
    <Bullets text={it.bullets} />
  </div>
);

const Title = ({ children }) => (
  <h2
    style={{
      ...body,
      fontSize: 12.5,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: C.brand,
      margin: "0 0 8px",
      fontWeight: 700,
    }}
  >
    {children}
  </h2>
);
const Block = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <Title>{title}</Title>
    {children}
  </div>
);

const filled = (o) =>
  o &&
  Object.entries(o).some(
    ([k, v]) => k !== "id" && typeof v === "string" && v.trim() !== "",
  );
const has = (a) => Array.isArray(a) && a.some(filled);
const clean = (a) => (Array.isArray(a) ? a.filter(filled) : []);
const PREF_LABELS = {
  remote: "Remote",
  relocate: "Relocation",
  hybrid: "Hybrid",
  travel: "Travel",
  onsite: "On-Site",
};
const prefs = (r) =>
  Object.entries(r.preferences || {})
    .filter(([, v]) => v)
    .map(([k]) => PREF_LABELS[k] || k);

/* ---------- CLASSIC (single column, ATS-friendly) ---------- */
export function ClassicResume({ r }) {
  const links = r.links || [];
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "44px 46px",
        color: C.ink,
        minHeight: 600,
        ...serif,
        ...fontVars({ font: "classic" }),
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: `2px solid ${C.brand}`,
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600 }}>{r.name}</h1>
        <div
          style={{
            fontSize: 15,
            color: C.brand,
            fontWeight: 600,
            marginTop: 3,
          }}
        >
          {r.title}
        </div>
        <div
          style={{
            ...body,
            fontSize: 12.5,
            color: C.soft,
            marginTop: 9,
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {r.email && <span>{r.email}</span>}
          {r.phone && <span>{r.phone}</span>}
          {loc(r) && <span>{loc(r)}</span>}
          {links.map((l) => (
            <span key={l.id} style={{ color: C.brand }}>
              {l.label || l.url}
            </span>
          ))}
          {prefs(r).length > 0 && (
            <span style={{ color: C.mute }}>
              Open to: {prefs(r).join(" · ")}
            </span>
          )}
        </div>
      </div>
      {r.summary && (
        <Block title="Summary">
          <p
            style={{
              ...body,
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: C.soft,
            }}
          >
            {r.summary}
          </p>
        </Block>
      )}
      {has(r.experience) && (
        <Block title="Experience">
          {clean(r.experience).map((e) => (
            <ExperienceItem key={e.id} e={e} />
          ))}
        </Block>
      )}
      {has(r.projects) && (
        <Block title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </Block>
      )}
      {has(r.skillGroups) && (
        <Block title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </Block>
      )}
      {has(r.education) && (
        <Block title="Education">
          {clean(r.education).map((e) => (
            <EduItem key={e.id} e={e} />
          ))}
        </Block>
      )}
      {has(r.certifications) && (
        <Block title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </Block>
      )}
      {has(r.achievements) && (
        <Block title="Achievements">
          <ul
            style={{
              ...body,
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </Block>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <Block key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </Block>
            ),
        )}
    </div>
  );
}

/* ---------- MODERN (sidebar) ---------- */
const SideTitle = ({ children }) => (
  <h3
    style={{
      ...body,
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "#9eccbd",
      margin: "0 0 9px",
      fontWeight: 700,
    }}
  >
    {children}
  </h3>
);
const SideBlock = ({ title, children }) => (
  <div style={{ marginTop: 22 }}>
    <SideTitle>{title}</SideTitle>
    {children}
  </div>
);
const MainTitle = ({ children }) => (
  <h2
    style={{
      ...serif,
      fontSize: 16,
      color: C.brand,
      margin: "0 0 9px",
      fontWeight: 600,
      borderBottom: `1px solid ${C.line}`,
      paddingBottom: 5,
    }}
  >
    {children}
  </h2>
);
const MainBlock = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <MainTitle>{title}</MainTitle>
    {children}
  </div>
);
const Row = ({ icon: Icon, t }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12,
      marginBottom: 6,
      color: "#dcefe7",
    }}
  >
    <Icon size={13} /> <span style={{ wordBreak: "break-all" }}>{t}</span>
  </div>
);

export function ModernResume({ r }) {
  const links = r.links || [];
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        display: "flex",
        overflow: "hidden",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "poppins" }),
      }}
    >
      <aside
        style={{
          width: "34%",
          background: C.brand,
          color: "#eef3f0",
          padding: "34px 22px",
        }}
      >
        <h1
          style={{
            ...serif,
            fontSize: 25,
            margin: 0,
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          {r.name}
        </h1>
        <div
          style={{
            fontSize: 13,
            color: "#bfe0d4",
            marginTop: 6,
            fontWeight: 600,
          }}
        >
          {r.title}
        </div>
        <SideBlock title="Contact">
          {r.email && <Row icon={Mail} t={r.email} />}
          {r.phone && <Row icon={Phone} t={r.phone} />}
          {loc(r) && <Row icon={MapPin} t={loc(r)} />}
          {links.map((l) => (
            <Row key={l.id} icon={LinkIcon} t={l.label || l.url} />
          ))}
          {prefs(r).length > 0 && (
            <div
              style={{
                fontSize: 11,
                color: "#bfe0d4",
                marginTop: 7,
                lineHeight: 1.4,
              }}
            >
              Open to: {prefs(r).join(", ")}
            </div>
          )}
        </SideBlock>
        {has(r.skillGroups) && (
          <SideBlock title="Skills">
            {clean(r.skillGroups).map((g) => (
              <div key={g.id} style={{ marginBottom: 8 }}>
                {g.category && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 3,
                    }}
                  >
                    {g.category}
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {items(g.items).map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        background: "rgba(255,255,255,.14)",
                        borderRadius: 12,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SideBlock>
        )}
        {has(r.education) && (
          <SideBlock title="Education">
            {clean(r.education).map((e) => (
              <div key={e.id} style={{ marginBottom: 11, fontSize: 12.5 }}>
                <strong style={{ color: "#fff" }}>{e.degree}</strong>
                <div style={{ color: "#bfe0d4" }}>{e.school}</div>
                <div style={{ color: "#9eccbd", fontSize: 11 }}>
                  {e.period} {e.detail && `· ${e.detail}`}
                </div>
              </div>
            ))}
          </SideBlock>
        )}
        {has(r.certifications) && (
          <SideBlock title="Certifications">
            {clean(r.certifications).map((c) => (
              <div key={c.id} style={{ marginBottom: 7, fontSize: 12 }}>
                <strong style={{ color: "#fff" }}>{c.name}</strong>
                <div style={{ color: "#bfe0d4" }}>
                  {c.issuer} {c.year && `· ${c.year}`}
                </div>
              </div>
            ))}
          </SideBlock>
        )}
      </aside>
      <main style={{ flex: 1, padding: "34px 28px" }}>
        {r.summary && (
          <MainBlock title="Profile">
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                lineHeight: 1.6,
                color: C.soft,
              }}
            >
              {r.summary}
            </p>
          </MainBlock>
        )}
        {has(r.experience) && (
          <MainBlock title="Experience">
            {clean(r.experience).map((e) => (
              <ExperienceItem key={e.id} e={e} />
            ))}
          </MainBlock>
        )}
        {has(r.projects) && (
          <MainBlock title="Projects">
            {clean(r.projects).map((p) => (
              <ProjectItem key={p.id} p={p} />
            ))}
          </MainBlock>
        )}
        {has(r.achievements) && (
          <MainBlock title="Achievements">
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                listStyleType: "disc",
                fontSize: 13,
                lineHeight: 1.55,
                color: C.soft,
              }}
            >
              {clean(r.achievements).map((a) => (
                <li key={a.id}>{a.text}</li>
              ))}
            </ul>
          </MainBlock>
        )}
        {has(r.custom) &&
          r.custom.map(
            (sec) =>
              has(sec.items) && (
                <MainBlock key={sec.id} title={sec.title || "Section"}>
                  {clean(sec.items).map((it) => (
                    <CustomItem key={it.id} it={it} />
                  ))}
                </MainBlock>
              ),
          )}
      </main>
    </div>
  );
}

/* ---------- PROFESSIONAL (premium single column, ATS-friendly) ---------- */
const ProTitle = ({ children }) => (
  <h2
    style={{
      ...body,
      fontSize: 12,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: C.ink,
      fontWeight: 700,
      margin: "0 0 10px",
      paddingBottom: 5,
      borderBottom: `1.5px solid ${C.ink}`,
    }}
  >
    {children}
  </h2>
);
const ProBlock = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <ProTitle>{title}</ProTitle>
    {children}
  </div>
);

export function ProfessionalResume({ r }) {
  const links = r.links || [];
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "46px 50px",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "lora" }),
      }}
    >
      <div>
        <h1
          style={{
            ...serif,
            margin: 0,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-.01em",
          }}
        >
          {r.name}
        </h1>
        <div
          style={{
            fontSize: 15,
            color: C.brand,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          {r.title}
        </div>
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: C.soft,
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 14px",
          margin: "12px 0 16px",
          paddingBottom: 16,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {r.email && <span>{r.email}</span>}
        {r.phone && <span>{r.phone}</span>}
        {loc(r) && <span>{loc(r)}</span>}
        {links.map((l) => (
          <span key={l.id} style={{ color: C.brand, fontWeight: 600 }}>
            {l.label || l.url}
          </span>
        ))}
        {prefs(r).length > 0 && (
          <span style={{ color: C.mute }}>Open to: {prefs(r).join(" · ")}</span>
        )}
      </div>
      {r.summary && (
        <ProBlock title="Summary">
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: C.soft,
            }}
          >
            {r.summary}
          </p>
        </ProBlock>
      )}
      {has(r.experience) && (
        <ProBlock title="Experience">
          {clean(r.experience).map((e) => (
            <ExperienceItem key={e.id} e={e} />
          ))}
        </ProBlock>
      )}
      {has(r.projects) && (
        <ProBlock title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </ProBlock>
      )}
      {has(r.skillGroups) && (
        <ProBlock title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </ProBlock>
      )}
      {has(r.education) && (
        <ProBlock title="Education">
          {clean(r.education).map((e) => (
            <EduItem key={e.id} e={e} />
          ))}
        </ProBlock>
      )}
      {has(r.certifications) && (
        <ProBlock title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </ProBlock>
      )}
      {has(r.achievements) && (
        <ProBlock title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </ProBlock>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <ProBlock key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </ProBlock>
            ),
        )}
    </div>
  );
}

/* ---------- STANDARD (matches the classic recruiter/ATS PDF format) ---------- */
const StdTitle = ({ children }) => (
  <h2
    style={{
      ...body,
      fontSize: 12.5,
      letterSpacing: ".10em",
      textTransform: "uppercase",
      color: C.ink,
      fontWeight: 700,
      margin: "16px 0 8px",
      paddingBottom: 4,
      borderBottom: "1px solid #9a948a",
    }}
  >
    {children}
  </h2>
);
const StdExp = ({ e }) => (
  <div style={{ marginBottom: 11 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div>
        <strong style={{ ...serif, fontSize: 14 }}>{e.role}</strong>
        {e.company && (
          <div style={{ ...body, fontSize: 13, color: C.soft }}>
            {e.company}
          </div>
        )}
      </div>
      <div
        style={{
          textAlign: "right",
          ...body,
          fontSize: 12,
          color: C.mute,
          minWidth: 110,
          flexShrink: 0,
        }}
      >
        {e.period && <div>{e.period}</div>}
        {e.location && <div>{e.location}</div>}
      </div>
    </div>
    <Bullets text={e.bullets} />
  </div>
);
const StdProj = ({ p }) => (
  <div style={{ marginBottom: 9 }}>
    <span>
      <strong style={{ ...serif, fontSize: 14 }}>{p.name}</strong>
      {p.link && (
        <span style={{ ...body, fontSize: 12, color: C.brand, marginLeft: 8 }}>
          {p.link}
        </span>
      )}
      {p.tech && (
        <span style={{ ...body, fontSize: 12, color: C.mute, marginLeft: 8 }}>
          {p.tech}
        </span>
      )}
    </span>
    {p.desc && (
      <div style={{ ...body, fontSize: 13, color: C.soft, lineHeight: 1.5 }}>
        {p.desc}
      </div>
    )}
  </div>
);
const StdSkills = ({ groups }) => (
  <div style={body}>
    {groups.map((g) => (
      <div
        key={g.id}
        style={{
          display: "flex",
          gap: 12,
          fontSize: 13,
          marginBottom: 5,
          color: C.soft,
        }}
      >
        <span
          style={{
            minWidth: 175,
            fontWeight: 700,
            color: C.ink,
            flexShrink: 0,
          }}
        >
          {g.category}
        </span>
        <span style={{ flex: 1 }}>{g.items}</span>
      </div>
    ))}
  </div>
);
const StdEdu = ({ e }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6,
      ...body,
      fontSize: 13,
      gap: 12,
    }}
  >
    <span>
      <strong style={serif}>{e.degree}</strong>
      {e.school && `, ${e.school}`}{" "}
      {e.detail && <em style={{ color: C.mute }}>· {e.detail}</em>}
    </span>
    <span
      style={{
        textAlign: "right",
        color: C.mute,
        fontSize: 12,
        minWidth: 110,
        flexShrink: 0,
      }}
    >
      {e.period}
    </span>
  </div>
);

export function StandardResume({ r }) {
  const parts = [
    r.phone,
    r.email,
    loc(r),
    ...(r.links || []).map((l) => l.label || l.url),
  ].filter(Boolean);
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "44px 48px",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "georgia" }),
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <h1 style={{ ...serif, margin: 0, fontSize: 28, fontWeight: 700 }}>
          {r.name}
        </h1>
        <div
          style={{ fontSize: 14, color: C.soft, fontWeight: 600, marginTop: 2 }}
        >
          {r.title}
        </div>
        <div style={{ fontSize: 12, color: C.soft, marginTop: 7 }}>
          {parts.map((p, i) => (
            <span key={i}>
              {i > 0 && (
                <span style={{ margin: "0 7px", color: C.mute }}>◇</span>
              )}
              {p}
            </span>
          ))}
          {prefs(r).length > 0 && (
            <div style={{ marginTop: 4 }}>Open to: {prefs(r).join(" · ")}</div>
          )}
        </div>
      </div>
      {r.summary && (
        <>
          <StdTitle>Summary</StdTitle>
          <p
            style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: C.soft }}
          >
            {r.summary}
          </p>
        </>
      )}
      {has(r.experience) && (
        <>
          <StdTitle>Work Experience</StdTitle>
          {clean(r.experience).map((e) => (
            <StdExp key={e.id} e={e} />
          ))}
        </>
      )}
      {has(r.projects) && (
        <>
          <StdTitle>Projects</StdTitle>
          {clean(r.projects).map((p) => (
            <StdProj key={p.id} p={p} />
          ))}
        </>
      )}
      {has(r.skillGroups) && (
        <>
          <StdTitle>Skills</StdTitle>
          <StdSkills groups={clean(r.skillGroups)} />
        </>
      )}
      {has(r.education) && (
        <>
          <StdTitle>Education</StdTitle>
          {clean(r.education).map((e) => (
            <StdEdu key={e.id} e={e} />
          ))}
        </>
      )}
      {has(r.certifications) && (
        <>
          <StdTitle>Certifications</StdTitle>
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </>
      )}
      {has(r.achievements) && (
        <>
          <StdTitle>Achievements</StdTitle>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <div key={sec.id}>
                <StdTitle>{sec.title || "Section"}</StdTitle>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </div>
            ),
        )}
    </div>
  );
}

/* ---------- MINIMAL (airy, sans-serif, hairline headings) ---------- */
const MinTitle = ({ children }) => (
  <h2
    style={{
      ...body,
      fontSize: 11.5,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: C.mute,
      fontWeight: 700,
      margin: "0 0 8px",
    }}
  >
    {children}
  </h2>
);
const MinBlock = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <MinTitle>{title}</MinTitle>
    {children}
  </div>
);

export function MinimalResume({ r }) {
  const links = r.links || [];
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "52px 56px",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "inter" }),
      }}
    >
      <h1
        style={{
          ...serif,
          margin: 0,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-.01em",
        }}
      >
        {r.name}
      </h1>
      <div style={{ fontSize: 14.5, color: C.soft, marginTop: 3 }}>
        {r.title}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: C.mute,
          marginTop: 10,
          marginBottom: 24,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        {r.email && <span>{r.email}</span>}
        {r.phone && <span>{r.phone}</span>}
        {loc(r) && <span>{loc(r)}</span>}
        {links.map((l) => (
          <span key={l.id} style={{ color: C.brand }}>
            {l.label || l.url}
          </span>
        ))}
        {prefs(r).length > 0 && <span>Open to: {prefs(r).join(" · ")}</span>}
      </div>
      {r.summary && (
        <MinBlock title="Summary">
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.65,
              color: C.soft,
            }}
          >
            {r.summary}
          </p>
        </MinBlock>
      )}
      {has(r.experience) && (
        <MinBlock title="Experience">
          {clean(r.experience).map((e) => (
            <ExperienceItem key={e.id} e={e} />
          ))}
        </MinBlock>
      )}
      {has(r.projects) && (
        <MinBlock title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </MinBlock>
      )}
      {has(r.skillGroups) && (
        <MinBlock title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </MinBlock>
      )}
      {has(r.education) && (
        <MinBlock title="Education">
          {clean(r.education).map((e) => (
            <EduItem key={e.id} e={e} />
          ))}
        </MinBlock>
      )}
      {has(r.certifications) && (
        <MinBlock title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </MinBlock>
      )}
      {has(r.achievements) && (
        <MinBlock title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </MinBlock>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <MinBlock key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </MinBlock>
            ),
        )}
    </div>
  );
}

/* ---------- ELEGANT (centered, Playfair, ruled section titles) ---------- */
const ElegTitle = ({ children }) => (
  <h2
    style={{
      ...serif,
      fontSize: 15,
      textAlign: "center",
      color: C.ink,
      fontWeight: 600,
      letterSpacing: ".04em",
      margin: "0 0 12px",
      position: "relative",
    }}
  >
    <span
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "52%",
        borderTop: `1px solid ${C.line}`,
      }}
    />
    <span
      style={{ position: "relative", background: "#fff", padding: "0 14px" }}
    >
      {children}
    </span>
  </h2>
);
const ElegBlock = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <ElegTitle>{title}</ElegTitle>
    {children}
  </div>
);

export function ElegantResume({ r }) {
  const links = r.links || [];
  const parts = [
    r.email,
    r.phone,
    loc(r),
    ...links.map((l) => l.label || l.url),
  ].filter(Boolean);
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "48px 54px",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "playfair" }),
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <h1 style={{ ...serif, margin: 0, fontSize: 34, fontWeight: 700 }}>
          {r.name}
        </h1>
        <div
          style={{
            fontSize: 14,
            color: C.brand,
            fontWeight: 600,
            marginTop: 4,
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          {r.title}
        </div>
        <div style={{ fontSize: 12.5, color: C.soft, marginTop: 9 }}>
          {parts.map((p, i) => (
            <span key={i}>
              {i > 0 && (
                <span style={{ margin: "0 8px", color: C.mute }}>•</span>
              )}
              {p}
            </span>
          ))}
          {prefs(r).length > 0 && (
            <div style={{ marginTop: 4, color: C.mute }}>
              Open to: {prefs(r).join(" · ")}
            </div>
          )}
        </div>
      </div>
      {r.summary && (
        <ElegBlock title="Summary">
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.65,
              color: C.soft,
              textAlign: "center",
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            {r.summary}
          </p>
        </ElegBlock>
      )}
      {has(r.experience) && (
        <ElegBlock title="Experience">
          {clean(r.experience).map((e) => (
            <ExperienceItem key={e.id} e={e} />
          ))}
        </ElegBlock>
      )}
      {has(r.projects) && (
        <ElegBlock title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </ElegBlock>
      )}
      {has(r.skillGroups) && (
        <ElegBlock title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </ElegBlock>
      )}
      {has(r.education) && (
        <ElegBlock title="Education">
          {clean(r.education).map((e) => (
            <EduItem key={e.id} e={e} />
          ))}
        </ElegBlock>
      )}
      {has(r.certifications) && (
        <ElegBlock title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </ElegBlock>
      )}
      {has(r.achievements) && (
        <ElegBlock title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </ElegBlock>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <ElegBlock key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </ElegBlock>
            ),
        )}
    </div>
  );
}

/* ---------- COMPACT (dense, Georgia, accent-bar titles) ---------- */
const CompTitle = ({ children }) => (
  <h2
    style={{
      ...body,
      fontSize: 11.5,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: C.ink,
      fontWeight: 700,
      margin: "0 0 6px",
      paddingLeft: 8,
      borderLeft: `3px solid ${C.brand}`,
    }}
  >
    {children}
  </h2>
);
const CompBlock = ({ title, children }) => (
  <div style={{ marginBottom: 12 }}>
    <CompTitle>{title}</CompTitle>
    {children}
  </div>
);

export function CompactResume({ r }) {
  const links = r.links || [];
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "36px 42px",
        color: C.ink,
        minHeight: 600,
        fontSize: 12.5,
        ...body,
        ...fontVars({ font: "lato" }),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: `2px solid ${C.brand}`,
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        <div>
          <h1 style={{ ...serif, margin: 0, fontSize: 24, fontWeight: 700 }}>
            {r.name}
          </h1>
          <div style={{ fontSize: 13, color: C.brand, fontWeight: 600 }}>
            {r.title}
          </div>
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: C.soft,
            textAlign: "right",
            lineHeight: 1.5,
          }}
        >
          {r.email && <div>{r.email}</div>}
          {r.phone && <div>{r.phone}</div>}
          {loc(r) && <div>{loc(r)}</div>}
          {links.map((l) => (
            <div key={l.id} style={{ color: C.brand }}>
              {l.label || l.url}
            </div>
          ))}
        </div>
      </div>
      {prefs(r).length > 0 && (
        <div style={{ fontSize: 11.5, color: C.mute, marginBottom: 10 }}>
          Open to: {prefs(r).join(" · ")}
        </div>
      )}
      {r.summary && (
        <CompBlock title="Summary">
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: C.soft,
            }}
          >
            {r.summary}
          </p>
        </CompBlock>
      )}
      {has(r.experience) && (
        <CompBlock title="Experience">
          {clean(r.experience).map((e) => (
            <ExperienceItem key={e.id} e={e} />
          ))}
        </CompBlock>
      )}
      {has(r.projects) && (
        <CompBlock title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </CompBlock>
      )}
      {has(r.skillGroups) && (
        <CompBlock title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </CompBlock>
      )}
      {has(r.education) && (
        <CompBlock title="Education">
          {clean(r.education).map((e) => (
            <EduItem key={e.id} e={e} />
          ))}
        </CompBlock>
      )}
      {has(r.certifications) && (
        <CompBlock title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </CompBlock>
      )}
      {has(r.achievements) && (
        <CompBlock title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 12.5,
              lineHeight: 1.5,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </CompBlock>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <CompBlock key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </CompBlock>
            ),
        )}
    </div>
  );
}

/* ---------- EXECUTIVE (matches an uploaded corporate resume: caps name, ruled uppercase sections) ---------- */
const ExecTitle = ({ children }) => (
  <h2
    style={{
      ...serif,
      fontSize: 14,
      letterSpacing: ".06em",
      fontVariant: "small-caps",
      textTransform: "none",
      color: C.ink,
      fontWeight: 700,
      margin: "0 0 9px",
      paddingBottom: 5,
      borderBottom: `1px solid ${C.ink}`,
    }}
  >
    {children}
  </h2>
);
const ExecBlock = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <ExecTitle>{title}</ExecTitle>
    {children}
  </div>
);
const ExecExp = ({ e }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <strong style={{ ...serif, fontSize: 14.5 }}>
        {e.company || e.role}
      </strong>
      {e.period && (
        <span style={{ ...body, fontSize: 12, color: C.mute, flexShrink: 0 }}>
          {e.period}
        </span>
      )}
    </div>
    {(e.company && e.role) || e.location ? (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          ...body,
          fontSize: 13,
        }}
      >
        <span style={{ color: C.soft, fontWeight: 600 }}>
          {e.company ? e.role : ""}
        </span>
        {e.location && (
          <span style={{ color: C.mute, fontSize: 12, flexShrink: 0 }}>
            {e.location}
          </span>
        )}
      </div>
    ) : null}
    <Bullets text={e.bullets} />
  </div>
);
const ExecEdu = ({ e }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6,
      ...body,
      fontSize: 13,
      gap: 12,
    }}
  >
    <span>
      <strong style={serif}>{e.school}</strong>
      {e.degree && <span style={{ color: C.soft }}> — {e.degree}</span>}
      {e.detail && <em style={{ color: C.mute }}> · {e.detail}</em>}
    </span>
    <span style={{ color: C.mute, fontSize: 12, flexShrink: 0 }}>
      {e.period}
    </span>
  </div>
);

export function ExecutiveResume({ r }) {
  const links = r.links || [];
  const href = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
  const contact = [];
  if (r.phone)
    contact.push({
      t: r.phone,
      href: `tel:${r.phone.replace(/[^\d+]/g, "")}`,
      brand: true,
    });
  if (r.email)
    contact.push({ t: r.email, href: `mailto:${r.email}`, brand: true });
  if (loc(r)) contact.push({ t: loc(r), href: null, brand: false });
  links.forEach((l) =>
    contact.push({
      t: l.label || l.url,
      href: href(l.url || l.label),
      brand: true,
    }),
  );
  return (
    <div
      id="resume-paper"
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.10)",
        padding: "44px 48px",
        color: C.ink,
        minHeight: 600,
        ...body,
        ...fontVars({ font: "ptserif" }),
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h1
          style={{
            ...serif,
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
            fontVariant: "small-caps",
            textTransform: "none",
            letterSpacing: ".04em",
          }}
        >
          {r.name}
        </h1>
        {r.title && (
          <div
            style={{
              fontSize: 14,
              color: C.brand,
              fontWeight: 600,
              marginTop: 3,
            }}
          >
            {r.title}
          </div>
        )}
        {contact.length > 0 && (
          <div style={{ fontSize: 12, color: C.soft, marginTop: 9 }}>
            {contact.map((c, i) => (
              <span key={i}>
                {i > 0 && (
                  <span style={{ margin: "0 7px", color: C.mute }}>•</span>
                )}
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: C.brand, textDecoration: "none" }}
                  >
                    {c.t}
                  </a>
                ) : (
                  <span>{c.t}</span>
                )}
              </span>
            ))}
          </div>
        )}
        {prefs(r).length > 0 && (
          <div style={{ fontSize: 12, color: C.mute, marginTop: 4 }}>
            Open to: {prefs(r).join(" · ")}
          </div>
        )}
      </div>
      {r.summary && (
        <ExecBlock title="Summary">
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: C.soft,
            }}
          >
            {r.summary}
          </p>
        </ExecBlock>
      )}
      {has(r.experience) && (
        <ExecBlock title="Work Experience">
          {clean(r.experience).map((e) => (
            <ExecExp key={e.id} e={e} />
          ))}
        </ExecBlock>
      )}
      {has(r.projects) && (
        <ExecBlock title="Projects">
          {clean(r.projects).map((p) => (
            <ProjectItem key={p.id} p={p} />
          ))}
        </ExecBlock>
      )}
      {has(r.skillGroups) && (
        <ExecBlock title="Skills">
          <SkillGroups groups={clean(r.skillGroups)} />
        </ExecBlock>
      )}
      {has(r.education) && (
        <ExecBlock title="Education">
          {clean(r.education).map((e) => (
            <ExecEdu key={e.id} e={e} />
          ))}
        </ExecBlock>
      )}
      {has(r.certifications) && (
        <ExecBlock title="Certifications">
          {clean(r.certifications).map((c) => (
            <CertItem key={c.id} c={c} />
          ))}
        </ExecBlock>
      )}
      {has(r.achievements) && (
        <ExecBlock title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              listStyleType: "disc",
              fontSize: 13,
              lineHeight: 1.55,
              color: C.soft,
            }}
          >
            {clean(r.achievements).map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </ExecBlock>
      )}
      {has(r.custom) &&
        r.custom.map(
          (sec) =>
            has(sec.items) && (
              <ExecBlock key={sec.id} title={sec.title || "Section"}>
                {clean(sec.items).map((it) => (
                  <CustomItem key={it.id} it={it} />
                ))}
              </ExecBlock>
            ),
        )}
    </div>
  );
}

export function ResumeRender({ r, template }) {
  if (template === "modern") return <ModernResume r={r} />;
  if (template === "professional") return <ProfessionalResume r={r} />;
  if (template === "standard") return <StandardResume r={r} />;
  if (template === "minimal") return <MinimalResume r={r} />;
  if (template === "elegant") return <ElegantResume r={r} />;
  if (template === "compact") return <CompactResume r={r} />;
  if (template === "executive") return <ExecutiveResume r={r} />;
  return <ClassicResume r={r} />;
}

/* Responsive wrapper: scales the fixed-width resume page to fit its container
   on ANY screen (big or small). Used by the Builder preview and Resume view. */
export function ResumePreview({ r, template }) {
  const wrapRef = useRef(null);
  const pageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [h, setH] = useState(0);
  const PAGE_W = 780;
  useEffect(() => {
    const measure = () => {
      const cw = wrapRef.current?.clientWidth || PAGE_W;
      const sc = Math.min(1.5, cw / PAGE_W); // scale down to fit, up to 1.5x to fill big screens
      const ph = pageRef.current?.offsetHeight || 0;
      setScale(sc);
      setH(ph * sc);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (pageRef.current) ro.observe(pageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <div style={{ width: PAGE_W * scale, height: h || "auto" }}>
        <div
          ref={pageRef}
          style={{
            width: PAGE_W,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          <ResumeRender r={r} template={template} />
        </div>
      </div>
    </div>
  );
}
