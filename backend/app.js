import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import setupRoutes from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/news_summarizer";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB: " + MONGODB_URI))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Middleware to log route calls
app.use((req, res, next) => {
  console.log(`Route called: ${req.method} ${req.path}`);
  next();
});

// Setup routes
setupRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
