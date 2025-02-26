const mongoose = require("mongoose");
const articleSchema = require('./models/article.js');
const siteSchema = require("./models/site.js");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/news_summarizer";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB: " + MONGODB_URI))
  .catch(err => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define Article Schema
const Article = mongoose.model("Article", articleSchema);
const Site = mongoose.model("Site", siteSchema);

let articles = [];

// Middleware to log route calls
app.use((req, res, next) => {
  console.log(`Route called: ${req.method} ${req.path}`);
  next();
});

// Legacy Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/receive-articles", (req, res) => {
  console.log("Received articles:", req.body);
  const newArticles = req.body;
  // Update existing articles or add new ones
  newArticles.forEach((newArticle) => {
    const index = articles.findIndex((a) => a.url === newArticle.url);
    if (index !== -1) {
      articles[index] = newArticle; // Update existing article
    } else {
      articles.push(newArticle); // Add new article
    }
  });
  console.log("Updated articles:", articles);
  res
    .status(200)
    .json({ message: "Articles received and updated successfully" });
});

app.get("/articles", (req, res) => {
  res.json(articles);
});

// MongoDB Routes
// Write new or overwrite based on the URL
app.post("/mongo-receive-articles", async (req, res) => {
  console.log("Received articles for MongoDB:", req.body);
  const newArticles = req.body;
  try {
    for (let newArticle of newArticles) {
      const result = await Article.findOneAndUpdate({ url: newArticle.url }, newArticle, {
        upsert: true,
        new: true,
      });
      console.log("Updated/Inserted article:", result);
    }
    console.log("Articles updated in MongoDB");
    res
      .status(200)
      .json({
        message: "Articles received and updated successfully in MongoDB",
      });
  } catch (error) {
    console.error("Error updating articles in MongoDB:", error);
    res.status(500).json({ message: "Error updating articles in MongoDB" });
  }
});

app.get("/mongo-articles", async (req, res) => {
  try {
    const mongoArticles = await Article.find()
      .sort({ publishDate: -1 })
      .limit(5);
    console.log("Fetched articles from MongoDB:", mongoArticles);
    res.json(mongoArticles);
  } catch (error) {
    console.error("Error fetching articles from MongoDB:", error);
    res.status(500).json({ message: "Error fetching articles from MongoDB" });
  }
});


// Test route for MongoDB -> Update to Post later
app.get("/test-mongo", async (req, res) => {
  try {
    const testArticle = await Article.create({
      title: "Test Article",
      url: "http://test.com",
      site: "http://test.com",
      author: "Test Author",
      date: new Date(),
      content: "Test content",
      summary: ["Test summary point 1", "Test summary point 2"],
    });
    console.log("Test article created:", testArticle);
    res.status(200).json({ message: "Test article created successfully", article: testArticle });
  } catch (error) {
    console.error("Error creating test article:", error);
    res.status(500).json({ message: "Error creating test article" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
