const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const articleSchema = require('./article'); // Assuming article.js is in the same directory

const Article = mongoose.model('Article', articleSchema);

function createArticle(title, url, author, publishDate, content, summary, imageUrl) {
  return new Article({
    title,
    url,
    author,
    publishDate: new Date(publishDate),
    content: Array.isArray(content) ? content : [content],
    summary: Array.isArray(summary) ? summary : [summary],
    imageUrl
  });
}

function loadTestArticles() {
  const filePath = path.join(__dirname, '..', '_test', 'sample_articles.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const articles = JSON.parse(rawData);
    return articles.map(article => createArticle(
      article.title,
      article.url,
      article.author,
      article.date,
      article.content,
      article.summary,
      article.imageUrl
    ));
  } catch (error) {
    console.error('Error loading test articles:', error);
    return [];
  }
}

async function saveTestArticlesToDB() {
  const articles = loadTestArticles();
  try {
    for (let article of articles) {
      await Article.findOneAndUpdate(
        { url: article.url },
        article.toObject(),
        { upsert: true, new: true }
      );
    }
    console.log('Test articles saved to database');
  } catch (error) {
    console.error('Error saving test articles to database:', error);
  }
}

module.exports = { createArticle, loadTestArticles, saveTestArticlesToDB };
