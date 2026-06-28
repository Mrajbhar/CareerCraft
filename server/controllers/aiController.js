const MODEL = "gemini-2.5-flash";
import User from "../models/User.js";
import { isPro } from "../lib/plan.js";
const apiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
export async function modelFor(userId) {
  try {
    const u = await User.findById(userId);
    return isPro(u) ? "gemini-2.5-pro" : MODEL;
  } catch {
    return MODEL;
  }
}
const hasKey = () => !!apiKey();

export async function ask(prompt, maxTokens = 1000, model = MODEL) {
  const isFlash = model.includes("flash");

  const genConfig = {
    temperature: 0.7,
    maxOutputTokens: maxTokens + (isFlash ? 0 : 1024),
    thinkingConfig: { thinkingBudget: isFlash ? 0 : 512 },
  };
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey(),
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: genConfig,
      }),
    },
  );
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`Gemini ${r.status}: ${detail.slice(0, 300)}`);
  }
  const data = await r.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || "")
    .join("")
    .trim();
  if (!text)
    throw new Error(
      "Gemini returned no text (response may have been blocked).",
    );
  return text;
}

export const generateSummary = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { title, skills, experience = [] } = req.body;
  try {
    const text = await ask(
      `Write a concise, confident professional resume summary (2-3 sentences, no "I"). ` +
        `Role: ${title}. Skills: ${skills}. ` +
        `Experience: ${experience.map((e) => `${e.role} at ${e.company}: ${e.bullets}`).join(" | ")}. ` +
        `Return ONLY the summary text, no preamble or quotes.`,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const polishBullets = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { role, company, notes } = req.body;
  try {
    const text = await ask(
      `Rewrite these resume bullet points to be impactful, action-verb led, and quantified where possible. ` +
        `Role: ${role} at ${company}. Raw notes:\n${notes}\n\n` +
        `Return ONLY 3-4 lines, one per line, no bullet symbols, no preamble.`,
    );
    res.json({ text: text.replace(/^[-•*]\s?/gm, "") });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const reviewResume = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { data } = req.body;
  try {
    const text = await ask(
      `You are an expert tech recruiter at a product-based company. Review this resume and give specific, actionable feedback. ` +
        `Structure it as: a one-line overall impression, then "Strengths:" with 2-3 points, then "Improvements:" with 3-4 concrete fixes ` +
        `(call out missing sections, bullets without metrics/numbers, vague wording, missing links). Keep under 220 words, plain text with short labels.\n\n` +
        `Resume JSON:\n${JSON.stringify(data)}`,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const generateCover = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const {
    data = {},
    jobTitle = "",
    company = "",
    jobDescription = "",
  } = req.body;
  try {
    const text = await ask(
      `Write a professional, confident cover letter (3 short paragraphs, about 180-230 words) for this candidate. ` +
        `Target role: ${jobTitle || data.title || "the role"}${company ? ` at ${company}` : ""}. ` +
        (jobDescription
          ? `Tailor it to this job description:\n${jobDescription}\n\n`
          : "") +
        `Open with a strong hook, highlight the most relevant experience and skills from the candidate's data, and end with a call to action. ` +
        `Use the candidate's real details only — do NOT invent employers, titles, or degrees. ` +
        `Begin with "Dear Hiring Manager," and finish with "Sincerely," on its own line followed by the candidate's name. ` +
        `Return ONLY the letter text, no preamble or notes.\n\nCandidate JSON:\n${JSON.stringify(data)}`,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const tailorResume = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { title, summary, skills, experience = [], jobDescription } = req.body;
  if (!jobDescription || jobDescription.trim().length < 30)
    return res.status(400).json({
      msg: "Please paste the job description (a couple of lines at least).",
    });
  try {
    const raw = await ask(
      `You are an expert resume coach. Tailor a candidate's resume to a specific job.\n` +
        `CANDIDATE TITLE: ${title || "N/A"}\n` +
        `CURRENT SUMMARY: ${summary || "N/A"}\n` +
        `SKILLS: ${skills || "N/A"}\n` +
        `EXPERIENCE: ${experience.map((e) => `${e.role} at ${e.company}: ${e.bullets}`).join(" | ") || "N/A"}\n` +
        `JOB DESCRIPTION:\n${jobDescription}\n\n` +
        `Return ONLY valid JSON (no markdown, no preamble) with this exact shape: ` +
        `{"summary": "rewritten 2-3 sentence summary tuned to this job, no first person", ` +
        `"bullets": ["5-7 strong, quantified bullet suggestions aligned to the job, each starting with an action verb"], ` +
        `"keywords": ["important skills/keywords from the job the resume should include"]}`,
      1500,
    );
    let data;
    try {
      data = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      return res
        .status(502)
        .json({ msg: "AI returned an unexpected format. Please try again." });
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const mockInterview = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const {
    role = "Software Engineer",
    history = [],
    answer = "",
    start = false,
  } = req.body;
  try {
    const convo = history
      .map((h, i) => `Q${i + 1}: ${h.q}\nA${i + 1}: ${h.a}`)
      .join("\n");
    const prompt = start
      ? `You are a friendly but sharp interviewer for a ${role} role. Ask the FIRST interview question (mix of behavioral and role-specific over the session). ` +
        `Return ONLY valid JSON: {"feedback": "", "question": "your first question"}. No markdown.`
      : `You are a friendly but sharp interviewer for a ${role} role.\nConversation so far:\n${convo}\n` +
        `The candidate just answered: "${answer}"\n` +
        `Give brief, constructive feedback (1-2 sentences) on that answer, then ask the next question (a follow-up or a new relevant one). ` +
        `Return ONLY valid JSON: {"feedback": "your feedback", "question": "next question"}. No markdown.`;
    const raw = await ask(prompt, 700);
    let data;
    try {
      data = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      data = { feedback: "", question: raw };
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const writeEmail = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { kind = "follow-up", details = "" } = req.body;
  if (!details.trim())
    return res
      .status(400)
      .json({ msg: "Add a few details about the situation." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `Write a professional, concise ${kind} email for a job seeker. Use the details below. ` +
        `Return ONLY the email (a short subject line on the first line as "Subject: ...", then the body). Warm but professional tone.\n\nDetails:\n${details}`,
      800,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const optimizeLinkedIn = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { about = "" } = req.body;
  if (about.trim().length < 20)
    return res
      .status(400)
      .json({ msg: "Paste your current LinkedIn About (a couple of lines)." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `Rewrite this LinkedIn "About" section to be punchier and more compelling, in first person, 3-5 short paragraphs, ` +
        `keeping it authentic and specific. Return ONLY the rewritten text.\n\nCurrent About:\n${about}`,
      900,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const quantifyBullets = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { bullets = "" } = req.body;
  if (!bullets.trim())
    return res
      .status(400)
      .json({ msg: "Paste one or more bullet points (one per line)." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `Rewrite these resume bullet points to be stronger: start with an action verb and add a realistic, quantified result where possible ` +
        `(use a clearly bracketed placeholder like [X%] or [N] when you don't have the number). Keep each to one line. ` +
        `Return ONLY the rewritten bullets, one per line, no numbering.\n\nBullets:\n${bullets}`,
      900,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const gapAnalysis = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { resume = "", jobDescription = "" } = req.body;
  if (resume.trim().length < 30 || jobDescription.trim().length < 30)
    return res
      .status(400)
      .json({ msg: "Paste both your resume text and the job description." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `Compare this candidate's resume to the job description. Return a concise, practical analysis with three short sections, using plain text headers: ` +
        `"Strengths" (where they match), "Gaps" (missing skills/keywords/experience), and "Action plan" (specific, prioritized steps to close the gaps). ` +
        `Use short dash bullets.\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      1200,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const solveHint = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { title = "", statement = "" } = req.body;
  if (!title && !statement)
    return res.status(400).json({ msg: "Missing problem." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `You are a coding interview coach. For the problem below, give ONE concise hint (2-3 sentences) that nudges toward the optimal approach WITHOUT writing code or fully giving away the answer.\n\nProblem: ${title}\n${statement}`,
      300,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

export const solveSolution = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add GEMINI_API_KEY to server/.env and restart the server.",
    });
  const { title = "", statement = "", difficulty = "" } = req.body;
  if (!title && !statement)
    return res.status(400).json({ msg: "Missing problem." });
  try {
    const model = await modelFor(req.userId);
    const text = await ask(
      `You are writing a clear editorial for this ${difficulty} coding problem. Use these plain-text sections with these exact headers:\n` +
        `"Intuition" (2-3 sentences), "Approach" (numbered steps), "Complexity" (Time and Space, with a one-line why), and "Python solution" (a clean, correct, well-named Python function in a single code block).\n\n` +
        `Problem: ${title}\n${statement}`,
      1400,
      model,
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};
