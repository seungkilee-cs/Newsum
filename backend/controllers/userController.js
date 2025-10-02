import User from "../models/user.js";
import Preference from "../models/preference.js";
import { registerSchema, loginSchema } from "../validators/userSchemas.js";

export const registerUser = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ username: parsed.username }, { email: parsed.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already in use",
      });
    }

    const newUser = new User({
      username: parsed.username,
      email: parsed.email,
      password: parsed.password,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
    });
    await newUser.save();

    const defaultPreference = new Preference({
      user: newUser._id,
      preferredSites: ["ALM", "CNN", "FOX"],
      preferredCategories: ["General", "Politic"],
    });
    await defaultPreference.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid registration payload",
        issues: error.issues,
      });
    }

    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await User.findOne({
      $or: [{ username: parsed.identifier }, { email: parsed.identifier }],
    }).select("+password username email");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(parsed.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid login payload",
        issues: error.issues,
      });
    }

    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
};

export const logoutUser = (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ message: "Already logged out" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
};
