const fs = require('fs');
const path = require('path');

function createArticle(title, url, content, summary) {
  return {
    title,
    url,
    content,
    summary,
    createdAt: new Date()
  };
}

function loadTestArticles() {
  // Go up one directory level from 'models', then into '_test'
  const filePath = path.join(__dirname, '..', '_test', 'sample_articles.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const articles = JSON.parse(rawData);
    return articles.map(article => createArticle(
      article.title,
      article.url,
      article.content,
      article.summary
    ));
  } catch (error) {
    console.error('Error loading test articles:', error);
    return []; // Return an empty array if there's an error
  }
}

module.exports = { createArticle, loadTestArticles };
