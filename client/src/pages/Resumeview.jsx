import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Pencil,
  Share2,
  Copy,
  Check,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import api from "../api";
import { ResumeStyles, ResumePreview } from "../components/ResumeTemplates";
import { DownloadBtn } from "../components/ui";
import { exportPDF, exportWord } from "../lib/exportResume";

export default function ResumeView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [resume, setResume] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/resumes/${id}`)
      .then((r) => setResume(r.data))
      .catch(() => nav("/"));
  }, [id, nav]);

  if (!resume) return <p style={{ padding: 30 }}>Loading…</p>;

  const shareUrl = resume.slug
    ? `${window.location.origin}/r/${resume.slug}`
    : "";

  const togglePublish = async (makePublic) => {
    setShareBusy(true);
    try {
      const { data } = await api.post(`/resumes/${id}/publish`, {
        public: makePublic,
      });
      setResume((prev) => ({
        ...prev,
        slug: data.slug,
        isPublic: data.isPublic,
      }));
    } catch (e) {
      /* ignore */
    }
    setShareBusy(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

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
            <button
              onClick={() => setShareOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-semibold transition ${resume.isPublic ? "border-brand/40 text-brand bg-brand/10" : "border-line text-ink bg-card hover:bg-paper"}`}
            >
              <Share2 size={15} /> Share
            </button>
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

        {/* share panel */}
        {shareOpen && (
          <div
            className="no-print mb-4 rounded-2xl border border-line bg-card p-4 sm:p-5"
            style={{ animation: "fadeUp .2s ease both" }}
          >
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>
            {resume.isPublic ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand mb-2">
                  <Globe size={15} /> Your resume is live
                </div>
                <p className="text-ink2 text-[13px] mb-3">
                  Anyone with this link can view it. Search engines won't index
                  it.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink outline-none"
                  />
                  <button
                    onClick={copy}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition"
                  >
                    {copied ? (
                      <>
                        <Check size={15} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={15} /> Copy link
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => togglePublish(false)}
                  disabled={shareBusy}
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-rust hover:underline disabled:opacity-60"
                >
                  {shareBusy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}{" "}
                  Make private
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
                  <Share2 size={15} /> Share your resume
                </div>
                <p className="text-ink2 text-[13px] mb-3">
                  Create a public link you can send to recruiters or add to your
                  profile. You can make it private again anytime.
                </p>
                <button
                  onClick={() => togglePublish(true)}
                  disabled={shareBusy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition disabled:opacity-60"
                >
                  {shareBusy ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Globe size={15} />
                  )}{" "}
                  Create public link
                </button>
              </>
            )}
          </div>
        )}

        <ResumePreview r={resume.data || {}} template={resume.template} />
      </div>
    </div>
  );
}
