import mongoose from "mongoose";
import User from "../models/user.js"; // Adjust the path as needed
import Preference from "../models/preference.js"; // Adjust the path as needed

import { testUsers } from "../data/sampleUserData.js";
import { testPreferences } from "../data/samplePreferenceData.js";

// MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/news_summarizer"; // Replace with your database name

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Function to insert test data
async function insertTestData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Preference.deleteMany({});

    for (let i = 0; i < testUsers.length; i++) {
      // Create user
      const user = new User(testUsers[i]);
      await user.save();

      // Create preference for user
      const preference = new Preference({
        user: user._id,
        ...testPreferences[i],
      });
      await preference.save();

      console.log(`Inserted test user and preference for ${user.username}`);
    }

    console.log("All test data inserted successfully");
  } catch (error) {
    console.error("Error inserting test data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
async function runScript() {
  await connectDB();
  await insertTestData();
}

runScript();
