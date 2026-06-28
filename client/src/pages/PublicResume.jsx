import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Printer, ArrowRight } from "lucide-react";
import api from "../api";
import { ResumeStyles, ResumePreview } from "../components/ResumeTemplates";

export default function PublicResume() {
  const { slug } = useParams();
  const [state, setState] = useState({
    loading: true,
    resume: null,
    error: "",
  });

  useEffect(() => {
    api
      .get(`/resumes/public/${slug}`)
      .then((r) => setState({ loading: false, resume: r.data, error: "" }))
      .catch((e) =>
        setState({
          loading: false,
          resume: null,
          error: e.response?.data?.msg || "This resume is not available.",
        }),
      );
  }, [slug]);

  if (state.loading)
    return (
      <div className="grid place-items-center py-32 text-ink2">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );

  if (state.error)
    return (
      <div className="grid place-items-center py-32 px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Resume not available
          </h1>
          <p className="text-ink2 mt-2 max-w-sm mx-auto">{state.error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors"
          >
            Go to CareerCraft <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );

  const { data, template } = state.resume;
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
        <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-3">
          <span className="text-sm text-ink2">
            Shared via{" "}
            <Link to="/" className="text-brand font-semibold hover:underline">
              CareerCraft
            </Link>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-line bg-card text-ink text-sm font-semibold hover:bg-paper transition"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Make your own <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <ResumePreview r={data || {}} template={template} />
      </div>
    </div>
  );
}
