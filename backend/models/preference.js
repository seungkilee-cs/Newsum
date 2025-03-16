import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userPreferenceSchema = new Schema(
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

const UserPreference = model("UserPreference", userPreferenceSchema);

export default UserPreference;
