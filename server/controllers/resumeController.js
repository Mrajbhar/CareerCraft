import Resume from "../models/Resume.js";

// GET /api/resumes  — list for the dashboard (lightweight fields)
export const listResumes = async (req, res) => {
  const list = await Resume.find({ user: req.userId })
    .select("title template updatedAt")
    .sort("-updatedAt");
  res.json(list);
};

// GET /api/resumes/:id  — full resume for builder + view
export const getResume = async (req, res) => {
  const r = await Resume.findOne({ _id: req.params.id, user: req.userId });
  if (!r) return res.status(404).json({ msg: "Not found" });
  res.json(r);
};

// POST /api/resumes
export const createResume = async (req, res) => {
  const r = await Resume.create({ ...req.body, user: req.userId });
  res.json(r);
};

// PUT /api/resumes/:id  — auto-save
export const updateResume = async (req, res) => {
  const r = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!r) return res.status(404).json({ msg: "Not found" });
  res.json(r);
};

// DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
  await Resume.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ msg: "Deleted" });
};

// ---- public sharing ----------------------------------------------------
import crypto from "crypto";

function slugify(s) {
  return (s || "resume").toString().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "resume";
}

// POST /api/resumes/:id/publish   { public: true|false }
export const setPublish = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });

    const makePublic = req.body.public !== false; // default true
    if (makePublic) {
      if (!resume.slug) {
        // unique slug: <title>-<6 hex>, retry on the rare collision
        let slug, exists = true, tries = 0;
        while (exists && tries < 5) {
          slug = `${slugify(resume.title || resume.data?.name)}-${crypto.randomBytes(3).toString("hex")}`;
          exists = await Resume.exists({ slug });
          tries++;
        }
        resume.slug = slug;
      }
      resume.isPublic = true;
    } else {
      resume.isPublic = false;
    }
    await resume.save();
    res.json({ slug: resume.slug, isPublic: resume.isPublic });
  } catch (e) {
    res.status(500).json({ msg: "Could not update sharing.", error: e.message });
  }
};

// GET /api/resumes/public/:slug   — no auth; only returns live public resumes
export const getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true })
      .select("title template data updatedAt");
    if (!resume) return res.status(404).json({ msg: "This resume is not available." });
    res.json(resume);
  } catch (e) {
    res.status(500).json({ msg: "Could not load resume.", error: e.message });
  }
};

// ---- version history ---------------------------------------------------
import ResumeVersion from "../models/ResumeVersion.js";

const MAX_VERSIONS = 30;

async function snapshot(resume, label) {
  await ResumeVersion.create({
    resume: resume._id, user: resume.user,
    title: resume.title, template: resume.template, data: resume.data, label,
  });
  // keep only the most recent MAX_VERSIONS per resume
  const old = await ResumeVersion.find({ resume: resume._id }).sort("-createdAt").skip(MAX_VERSIONS).select("_id");
  if (old.length) await ResumeVersion.deleteMany({ _id: { $in: old.map((v) => v._id) } });
}

// GET /api/resumes/:id/versions  — list (lightweight, no data)
export const listVersions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId }).select("_id");
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    const versions = await ResumeVersion.find({ resume: resume._id }).sort("-createdAt").select("title template label createdAt");
    res.json(versions);
  } catch (e) { res.status(500).json({ msg: "Could not load history.", error: e.message }); }
};

// POST /api/resumes/:id/versions  — snapshot the current resume now
export const createVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    await snapshot(resume, req.body.label || "Manual save");
    const versions = await ResumeVersion.find({ resume: resume._id }).sort("-createdAt").select("title template label createdAt");
    res.json(versions);
  } catch (e) { res.status(500).json({ msg: "Could not save version.", error: e.message }); }
};

// POST /api/resumes/:id/versions/:vid/restore  — restore a version (current is snapshotted first)
export const restoreVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    const version = await ResumeVersion.findOne({ _id: req.params.vid, resume: resume._id });
    if (!version) return res.status(404).json({ msg: "Version not found." });
    // snapshot current state so the restore is undoable
    await snapshot(resume, "Before restore");
    resume.title = version.title;
    resume.template = version.template;
    resume.data = version.data;
    await resume.save();
    res.json(resume);
  } catch (e) { res.status(500).json({ msg: "Could not restore version.", error: e.message }); }
};

// ---- import from PDF / DOCX -------------------------------------------
import { ask } from "./aiController.js";

// POST /api/resumes/import   (multipart: field "file")  -> { id }
// Best-effort import when AI isn't available — pulls out contact info and keeps the
// full text in the summary so the user can reorganize it into sections by hand.
function basicParse(text) {
  const clean = String(text || "").replace(/\r/g, "");
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const email = (clean.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [""])[0];
  const phone = (clean.match(/(\+?\d[\d\s().-]{7,}\d)/) || [""])[0];
  const name = lines.find((l) => !l.includes("@") && !/\d{3,}/.test(l) && l.length <= 40) || lines[0] || "";
  const parts = name.split(/\s+/);
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ");
  return {
    firstName, lastName, name, title: "",
    email, phone, location: "",
    links: [], summary: clean.slice(0, 4000),
    experience: [], projects: [],
    education: [], skillGroups: [{ category: "Skills", items: "" }],
    certifications: [],
  };
}

export const importResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });
    const name = (req.file.originalname || "").toLowerCase();
    const mime = req.file.mimetype || "";
    let text = "";

    if (name.endsWith(".pdf") || mime === "application/pdf") {
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const parsed = await pdfParse(req.file.buffer);
      text = parsed.text || "";
    } else if (name.endsWith(".docx") || mime.includes("word") || mime.includes("officedocument")) {
      const mammoth = await import("mammoth");
      const r = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = r.value || "";
    } else {
      return res.status(400).json({ msg: "Please upload a PDF or DOCX file." });
    }

    text = text.replace(/[ \t]+\n/g, "\n").trim().slice(0, 12000);
    if (text.length < 30) {
      return res.status(400).json({ msg: "Couldn't read text from that file. If it's a scanned/image PDF, try a text-based file." });
    }

    // Try a clean AI-structured parse (Flash = higher free-tier quota); fall back to a
    // basic import if AI is unavailable so the upload still lands in an editable resume.
    let parsed = null;
    try {
      const prompt = [
        "You are a resume parser. Convert the resume text below into JSON ONLY (no markdown, no commentary), with EXACTLY this shape:",
        '{"firstName":"","lastName":"","title":"","email":"","phone":"","location":"","links":[{"label":"","url":""}],"summary":"","experience":[{"role":"","company":"","location":"","from":"","to":"","current":false,"bullets":""}],"projects":[{"name":"","link":"","bullets":""}],"education":[{"school":"","degree":"","field":"","from":"","to":"","current":false}],"skillGroups":[{"category":"Skills","items":""}],"certifications":[{"name":"","issuer":"","year":""}]}',
        'Rules: "bullets" must be a single string with each bullet on its own line. "items" must be a comma-separated string. Use "" for anything missing. Do NOT invent facts that are not in the text.',
        "RESUME TEXT:",
        text,
      ].join("\n");
      let raw = await ask(prompt, 2400); // default model = gemini-2.5-flash (higher quota)
      raw = (raw || "").replace(/```json|```/g, "").trim();
      try { parsed = JSON.parse(raw); }
      catch { const mm = raw.match(/\{[\s\S]*\}/); if (mm) { try { parsed = JSON.parse(mm[0]); } catch {} } }
    } catch (aiErr) {
      console.warn("[importResume] AI parse unavailable, using basic import:", String(aiErr && aiErr.message));
    }

    const aiUsed = !!(parsed && typeof parsed === "object");
    if (!aiUsed) parsed = basicParse(text);

    parsed.name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || parsed.name || "";
    const resume = await Resume.create({
      user: req.userId,
      title: parsed.name ? `${parsed.name}'s Resume` : "Imported Resume",
      template: "classic",
      data: parsed,
    });
    res.json({ id: resume._id, ai: aiUsed });
  } catch (e) {
    const m = String((e && e.message) || e);
    console.error("[importResume]", m);
    let msg = "Import failed. Please try a different PDF or DOCX file.";
    if (m.includes("Cannot find package") || m.includes("ERR_MODULE_NOT_FOUND") || m.includes("Cannot find module")) {
      msg = "Import needs extra packages. In the server folder run:  npm install multer pdf-parse mammoth  — then restart the server.";
    } else if (m.toLowerCase().includes("gemini") || m.includes("no text") || m.includes("blocked")) {
      msg = "The AI couldn't process that resume (check GEMINI_API_KEY / quota). Please try again.";
    } else if (m.includes("ENOENT") && m.includes("05-versions-space")) {
      msg = "Old pdf-parse code is still running — replace server/controllers/resumeController.js and restart.";
    }
    res.status(500).json({ msg, error: m });
  }
};