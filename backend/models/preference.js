const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    preferredSites: {
      type: [String],
      default: [],
    },
    preferredCategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);

module.exports = UserPreference;
