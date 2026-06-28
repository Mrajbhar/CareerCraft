import Resume from "../models/Resume.js";

export const listResumes = async (req, res) => {
  const list = await Resume.find({ user: req.userId })
    .select("title template updatedAt")
    .sort("-updatedAt");
  res.json(list);
};

export const getResume = async (req, res) => {
  const r = await Resume.findOne({ _id: req.params.id, user: req.userId });
  if (!r) return res.status(404).json({ msg: "Not found" });
  res.json(r);
};

export const createResume = async (req, res) => {
  const r = await Resume.create({ ...req.body, user: req.userId });
  res.json(r);
};

export const updateResume = async (req, res) => {
  const r = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true },
  );
  if (!r) return res.status(404).json({ msg: "Not found" });
  res.json(r);
};

export const deleteResume = async (req, res) => {
  await Resume.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ msg: "Deleted" });
};

import crypto from "crypto";

function slugify(s) {
  return (
    (s || "resume")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "resume"
  );
}

export const setPublish = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });

    const makePublic = req.body.public !== false;
    if (makePublic) {
      if (!resume.slug) {
        let slug,
          exists = true,
          tries = 0;
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
    res
      .status(500)
      .json({ msg: "Could not update sharing.", error: e.message });
  }
};

export const getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      slug: req.params.slug,
      isPublic: true,
    }).select("title template data updatedAt");
    if (!resume)
      return res.status(404).json({ msg: "This resume is not available." });
    res.json(resume);
  } catch (e) {
    res.status(500).json({ msg: "Could not load resume.", error: e.message });
  }
};

import ResumeVersion from "../models/ResumeVersion.js";

const MAX_VERSIONS = 30;

async function snapshot(resume, label) {
  await ResumeVersion.create({
    resume: resume._id,
    user: resume.user,
    title: resume.title,
    template: resume.template,
    data: resume.data,
    label,
  });
  const old = await ResumeVersion.find({ resume: resume._id })
    .sort("-createdAt")
    .skip(MAX_VERSIONS)
    .select("_id");
  if (old.length)
    await ResumeVersion.deleteMany({ _id: { $in: old.map((v) => v._id) } });
}

export const listVersions = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId,
    }).select("_id");
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    const versions = await ResumeVersion.find({ resume: resume._id })
      .sort("-createdAt")
      .select("title template label createdAt");
    res.json(versions);
  } catch (e) {
    res.status(500).json({ msg: "Could not load history.", error: e.message });
  }
};

export const createVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    await snapshot(resume, req.body.label || "Manual save");
    const versions = await ResumeVersion.find({ resume: resume._id })
      .sort("-createdAt")
      .select("title template label createdAt");
    res.json(versions);
  } catch (e) {
    res.status(500).json({ msg: "Could not save version.", error: e.message });
  }
};

export const restoreVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!resume) return res.status(404).json({ msg: "Resume not found." });
    const version = await ResumeVersion.findOne({
      _id: req.params.vid,
      resume: resume._id,
    });
    if (!version) return res.status(404).json({ msg: "Version not found." });
    await snapshot(resume, "Before restore");
    resume.title = version.title;
    resume.template = version.template;
    resume.data = version.data;
    await resume.save();
    res.json(resume);
  } catch (e) {
    res
      .status(500)
      .json({ msg: "Could not restore version.", error: e.message });
  }
};

import { ask, modelFor } from "./aiController.js";

export const importResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });
    const name = (req.file.originalname || "").toLowerCase();
    const mime = req.file.mimetype || "";
    let text = "";

    if (name.endsWith(".pdf") || mime === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(req.file.buffer);
      text = parsed.text || "";
    } else if (
      name.endsWith(".docx") ||
      mime.includes("word") ||
      mime.includes("officedocument")
    ) {
      const mammoth = await import("mammoth");
      const r = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = r.value || "";
    } else {
      return res.status(400).json({ msg: "Please upload a PDF or DOCX file." });
    }

    text = text
      .replace(/[ \t]+\n/g, "\n")
      .trim()
      .slice(0, 12000);
    if (text.length < 30) {
      return res.status(400).json({
        msg: "Couldn't read text from that file. If it's a scanned/image PDF, try a text-based file.",
      });
    }

    const model = await modelFor(req.userId);
    const prompt = [
      "You are a resume parser. Convert the resume text below into JSON ONLY (no markdown, no commentary), with EXACTLY this shape:",
      '{"firstName":"","lastName":"","title":"","email":"","phone":"","location":"","links":[{"label":"","url":""}],"summary":"","experience":[{"role":"","company":"","location":"","from":"","to":"","current":false,"bullets":""}],"projects":[{"name":"","link":"","bullets":""}],"education":[{"school":"","degree":"","field":"","from":"","to":"","current":false}],"skillGroups":[{"category":"Skills","items":""}],"certifications":[{"name":"","issuer":"","year":""}]}',
      'Rules: "bullets" must be a single string with each bullet on its own line. "items" must be a comma-separated string. Use "" for anything missing. Do NOT invent facts that are not in the text.',
      "RESUME TEXT:",
      text,
    ].join("\n");

    let raw = await ask(prompt, 2400, model);
    raw = (raw || "").replace(/```json|```/g, "").trim();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch {}
      }
    }
    if (!parsed || typeof parsed !== "object") {
      return res
        .status(502)
        .json({ msg: "Couldn't understand the resume. Please try again." });
    }

    parsed.name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim();
    const resume = await Resume.create({
      user: req.userId,
      title: parsed.name ? `${parsed.name}'s Resume` : "Imported Resume",
      template: "classic",
      data: parsed,
    });
    res.json({ id: resume._id });
  } catch (e) {
    res.status(500).json({ msg: "Import failed.", error: e.message });
  }
};
