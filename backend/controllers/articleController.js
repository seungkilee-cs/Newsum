import Article from "../models/article.js";

let articles = [];

export const receiveArticles = (req, res) => {
  console.log("Received articles:", req.body);
  const newArticles = req.body;

  newArticles.forEach((newArticle) => {
    const index = articles.findIndex((a) => a.url === newArticle.url);
    if (index !== -1) {
      articles[index] = newArticle;
    } else {
      articles.push(newArticle);
    }
  });

  console.log("Updated articles:", articles);
  res
    .status(200)
    .json({ message: "Articles received and updated successfully" });
};

export const getArticles = (req, res) => {
  res.json(articles);
};

export const receiveMongoArticles = async (req, res) => {
  console.log("Received articles for MongoDB:", req.body);
  const newArticles = req.body;

  try {
    for (let newArticle of newArticles) {
      const result = await Article.findOneAndUpdate(
        { url: newArticle.url },
        newArticle,
        {
          upsert: true,
          new: true,
        },
      );
      console.log("Updated/Inserted article:", result);
    }
    console.log("Articles updated in MongoDB");
    res.status(200).json({
      message: "Articles received and updated successfully in MongoDB",
    });
  } catch (error) {
    console.error("Error updating articles in MongoDB:", error);
    res.status(500).json({ message: "Error updating articles in MongoDB" });
  }
};

export const getMongoArticles = async (req, res) => {
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
};

export const testMongo = async (req, res) => {
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
    res.status(200).json({
      message: "Test article created successfully",
      article: testArticle,
    });
  } catch (error) {
    console.error("Error creating test article:", error);
    res.status(500).json({ message: "Error creating test article" });
  }
};
