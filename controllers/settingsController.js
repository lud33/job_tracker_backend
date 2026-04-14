import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  let settings = await Settings.findOne({ user: req.user });

  if (!settings) {
    settings = await Settings.create({ user: req.user });
  }

  res.json(settings);
};

export const updateSettings = async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { user: req.user },
    req.body,
    { new: true, upsert: true }
  );

  res.json(settings);
};