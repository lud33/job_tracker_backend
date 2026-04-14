import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ user: req.user });
  res.json(jobs);
};

export const addJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    user: req.user,
  });
  res.json(job);
};

export const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(job);
};

export const deleteJob = async (req, res) => {
  await Job.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });
  res.json({ message: "Deleted" });
};