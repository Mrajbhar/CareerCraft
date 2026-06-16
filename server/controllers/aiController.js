// ===> place at: server/controllers/aiController.js
// Uses Google AI Studio (Gemini API) via built-in fetch — no SDK install needed (Node 18+).
const MODEL = "gemini-2.5-flash"; // stable + free-tier; swap to "gemini-2.5-pro" for higher quality
const apiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const hasKey = () => !!apiKey();

async function ask(prompt, maxTokens = 1000) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
      }),
    }
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
  if (!text) throw new Error("Gemini returned no text (response may have been blocked).");
  return text;
}

// POST /api/ai/summary
export const generateSummary = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { title, skills, experience = [] } = req.body;
  try {
    const text = await ask(
      `Write a concise, confident professional resume summary (2-3 sentences, no "I"). ` +
      `Role: ${title}. Skills: ${skills}. ` +
      `Experience: ${experience.map((e) => `${e.role} at ${e.company}: ${e.bullets}`).join(" | ")}. ` +
      `Return ONLY the summary text, no preamble or quotes.`
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

// POST /api/ai/bullets
export const polishBullets = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { role, company, notes } = req.body;
  try {
    const text = await ask(
      `Rewrite these resume bullet points to be impactful, action-verb led, and quantified where possible. ` +
      `Role: ${role} at ${company}. Raw notes:\n${notes}\n\n` +
      `Return ONLY 3-4 lines, one per line, no bullet symbols, no preamble.`
    );
    res.json({ text: text.replace(/^[-•*]\s?/gm, "") });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

// POST /api/ai/review
export const reviewResume = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { data } = req.body;
  try {
    const text = await ask(
      `You are an expert tech recruiter at a product-based company. Review this resume and give specific, actionable feedback. ` +
      `Structure it as: a one-line overall impression, then "Strengths:" with 2-3 points, then "Improvements:" with 3-4 concrete fixes ` +
      `(call out missing sections, bullets without metrics/numbers, vague wording, missing links). Keep under 220 words, plain text with short labels.\n\n` +
      `Resume JSON:\n${JSON.stringify(data)}`
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

// POST /api/ai/cover  — generate a tailored cover letter
export const generateCover = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { data = {}, jobTitle = "", company = "", jobDescription = "" } = req.body;
  try {
    const text = await ask(
      `Write a professional, confident cover letter (3 short paragraphs, about 180-230 words) for this candidate. ` +
      `Target role: ${jobTitle || data.title || "the role"}${company ? ` at ${company}` : ""}. ` +
      (jobDescription ? `Tailor it to this job description:\n${jobDescription}\n\n` : "") +
      `Open with a strong hook, highlight the most relevant experience and skills from the candidate's data, and end with a call to action. ` +
      `Use the candidate's real details only — do NOT invent employers, titles, or degrees. ` +
      `Begin with "Dear Hiring Manager," and finish with "Sincerely," on its own line followed by the candidate's name. ` +
      `Return ONLY the letter text, no preamble or notes.\n\nCandidate JSON:\n${JSON.stringify(data)}`
    );
    res.json({ text });
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

// POST /api/ai/tailor  (Pro only) — rewrite resume for a specific job description
export const tailorResume = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { title, summary, skills, experience = [], jobDescription } = req.body;
  if (!jobDescription || jobDescription.trim().length < 30)
    return res.status(400).json({ msg: "Please paste the job description (a couple of lines at least)." });
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
      1500
    );
    let data;
    try { data = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
    catch { return res.status(502).json({ msg: "AI returned an unexpected format. Please try again." }); }
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};

// POST /api/ai/interview  (Pro only) — one turn of a mock interview
export const mockInterview = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({ msg: "AI not configured", error: "Add GEMINI_API_KEY to server/.env and restart the server." });
  const { role = "Software Engineer", history = [], answer = "", start = false } = req.body;
  try {
    const convo = history.map((h, i) => `Q${i + 1}: ${h.q}\nA${i + 1}: ${h.a}`).join("\n");
    const prompt = start
      ? `You are a friendly but sharp interviewer for a ${role} role. Ask the FIRST interview question (mix of behavioral and role-specific over the session). ` +
        `Return ONLY valid JSON: {"feedback": "", "question": "your first question"}. No markdown.`
      : `You are a friendly but sharp interviewer for a ${role} role.\nConversation so far:\n${convo}\n` +
        `The candidate just answered: "${answer}"\n` +
        `Give brief, constructive feedback (1-2 sentences) on that answer, then ask the next question (a follow-up or a new relevant one). ` +
        `Return ONLY valid JSON: {"feedback": "your feedback", "question": "next question"}. No markdown.`;
    const raw = await ask(prompt, 700);
    let data;
    try { data = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
    catch { data = { feedback: "", question: raw }; }
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: "AI error", error: e.message });
  }
};