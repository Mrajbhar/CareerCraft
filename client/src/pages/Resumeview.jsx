import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Pencil } from "lucide-react";
import api from "../api";
import { ResumeStyles, ResumePreview } from "../components/ResumeTemplates";
import { DownloadBtn } from "../components/ui";
import { exportPDF, exportWord } from "../lib/exportResume";

export default function ResumeView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    api
      .get(`/resumes/${id}`)
      .then((r) => setResume(r.data))
      .catch(() => nav("/"));
  }, [id, nav]);

  if (!resume) return <p style={{ padding: 30 }}>Loading…</p>;

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "calc(100vh - 61px)",
        padding: 24,
      }}
    >
      <ResumeStyles />
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <button
            onClick={() => nav("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--color-ink2)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <ArrowLeft size={17} /> Dashboard
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <DownloadBtn
              onClick={() => nav(`/builder/${id}`)}
              icon={Pencil}
              label="Edit"
            />
            <DownloadBtn
              onClick={exportPDF}
              icon={Download}
              label="PDF"
              primary
            />
            <DownloadBtn
              onClick={() => exportWord(resume.data?.name)}
              icon={FileText}
              label="Word"
            />
          </div>
        </div>
        <ResumePreview r={resume.data || {}} template={resume.template} />
      </div>
    </div>
  );
}
