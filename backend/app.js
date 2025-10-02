import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import setupRoutes from "./routes/index.js";

// Load environment variables
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["http://localhost:5173"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/news_summarizer";

export async function connectDB(uri = MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB: " + uri);
  return mongoose.connection;
}

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:"),
);

// Middleware to log route calls
app.use((req, res, next) => {
  console.log(`Route called: ${req.method} ${req.path}`);
  next();
});

// Setup routes
setupRoutes(app);

// Start server
if (process.env.NODE_ENV !== "test") {
  connectDB(MONGODB_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}

export default app;
