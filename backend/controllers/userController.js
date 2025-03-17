import User from "../models/user.js";
import Preference from "../models/preference.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });
    await newUser.save();

    const defaultPreference = new Preference({
      user: newUser._id,
      preferredSites: ["ALM", "CNN", "FOX"],
      preferredCategories: ["General", "Politic"],
    });
    await defaultPreference.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};
