import mongoose from "mongoose";
const { Schema, model } = mongoose;

// User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Create and export the User model
const User = model("User", userSchema);

export default User;
