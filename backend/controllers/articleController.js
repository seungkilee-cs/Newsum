import Article from "../models/article.js";
import { normalizeArticlePayload } from "../utils/articleUtils.js";
import mockArticles from "../data/mockArticles.js";

let articles = [];

export const receiveArticles = (req, res) => {
  const incomingArticles = req.validatedBody ?? req.body;

  try {
    const normalizedArticles = incomingArticles.map(normalizeArticlePayload);

    normalizedArticles.forEach((normalizedArticle) => {
      const index = articles.findIndex((a) => a.url === normalizedArticle.url);
      if (index !== -1) {
        articles[index] = normalizedArticle;
      } else {
        articles.push(normalizedArticle);
      }
    });

    return res.status(200).json({
      message: "Articles received and updated successfully",
      count: normalizedArticles.length,
    });
  } catch (error) {
    console.error("Error normalizing in-memory articles:", error);
    return res.status(400).json({
      message: "Invalid article payload",
      details: error.message,
    });
  }
};

export const getArticles = (req, res) => {
  res.json(articles);
};

export const receiveMongoArticles = async (req, res) => {
  const incomingArticles = req.validatedBody ?? req.body;

  try {
    const normalizedArticles = incomingArticles.map(normalizeArticlePayload);

    for (const normalizedArticle of normalizedArticles) {
      await Article.findOneAndUpdate(
        { url: normalizedArticle.url },
        {
          $set: {
            ...normalizedArticle,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );
    }

    return res.status(200).json({
      message: "Articles received and updated successfully in MongoDB",
      count: normalizedArticles.length,
    });
  } catch (error) {
    console.error("Error updating articles in MongoDB:", error);
    return res.status(500).json({ message: "Error updating articles in MongoDB" });
  }
};

export const getMongoArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      site,
      startDate,
      endDate,
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const filter = {};
    if (site) {
      filter.site = site;
    }

    if (startDate || endDate) {
      filter.publishDate = {};
      if (startDate) {
        filter.publishDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.publishDate.$lte = new Date(endDate);
      }
    }

    const [mongoArticles, totalDocuments] = await Promise.all([
      Article.find(filter)
        .sort({ publishDate: -1, createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Article.countDocuments(filter),
    ]);

    const articlesToReturn = mongoArticles.length ? mongoArticles : mockArticles;
    const totalDocs = mongoArticles.length ? totalDocuments : mockArticles.length;

    return res.json({
      data: articlesToReturn,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalDocuments: totalDocs,
        totalPages: Math.ceil(totalDocs / limitNumber) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching articles from MongoDB:", error);
    return res.json({
      data: mockArticles,
      pagination: {
        page: 1,
        limit: mockArticles.length,
        totalDocuments: mockArticles.length,
        totalPages: 1,
      },
    });
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
