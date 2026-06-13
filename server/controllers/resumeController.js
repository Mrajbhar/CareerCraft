
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
