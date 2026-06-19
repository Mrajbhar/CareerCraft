import Progress from "../models/Progress.js";

const today = () => new Date().toISOString().slice(0, 10);

async function getOrCreate(userId) {
  let p = await Progress.findOne({ userId });
  if (!p) p = await Progress.create({ userId });
  return p;
}

function markDay(p) {
  const d = today();
  if (!p.days.includes(d)) p.days.push(d);
}

export const getProgress = async (req, res) => {
  try {
    const p = await getOrCreate(req.userId);
    res.json({ solved: p.solved, submissions: p.submissions, days: p.days });
  } catch (e) {
    res.status(500).json({ msg: "Could not load progress", error: e.message });
  }
};

export const toggleSolved = async (req, res) => {
  try {
    const { problem, solved } = req.body;
    if (!problem) return res.status(400).json({ msg: "Missing problem." });
    const p = await getOrCreate(req.userId);
    const has = p.solved.includes(problem);
    if (solved && !has) {
      p.solved.push(problem);
      markDay(p);
    } else if (!solved && has) {
      p.solved = p.solved.filter((x) => x !== problem);
    }
    await p.save();
    res.json({ solved: p.solved });
  } catch (e) {
    res
      .status(500)
      .json({ msg: "Could not update progress", error: e.message });
  }
};

export const addSubmission = async (req, res) => {
  try {
    const { problem, verdict = "Attempted", language = "python" } = req.body;
    if (!problem) return res.status(400).json({ msg: "Missing problem." });
    const p = await getOrCreate(req.userId);
    p.submissions.unshift({ problem, verdict, language, at: new Date() });
    if (p.submissions.length > 100) p.submissions = p.submissions.slice(0, 100);
    if (verdict === "Accepted" && !p.solved.includes(problem))
      p.solved.push(problem);
    markDay(p);
    await p.save();
    res.json({ solved: p.solved, submissions: p.submissions.slice(0, 20) });
  } catch (e) {
    res
      .status(500)
      .json({ msg: "Could not record submission", error: e.message });
  }
};
