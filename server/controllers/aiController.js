import Anthropic from "@anthropic-ai/sdk";

const hasKey = () => !!process.env.ANTHROPIC_API_KEY;
const client = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function ask(prompt) {
  const msg = await client().messages.create({
    model: "claude-haiku-4-5-20251001", // cheap + fast; change to claude-sonnet-4-6 for higher quality
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
}

// POST /api/ai/summary
export const generateSummary = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add ANTHROPIC_API_KEY to server/.env and restart the server.",
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

// POST /api/ai/bullets
export const polishBullets = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add ANTHROPIC_API_KEY to server/.env and restart the server.",
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

// POST /api/ai/review
export const reviewResume = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add ANTHROPIC_API_KEY to server/.env and restart the server.",
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

// POST /api/ai/cover  — generate a tailored cover letter
export const generateCover = async (req, res) => {
  if (!hasKey())
    return res.status(400).json({
      msg: "AI not configured",
      error: "Add ANTHROPIC_API_KEY to server/.env and restart the server.",
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
