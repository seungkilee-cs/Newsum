const fs = require('fs');
const path = require('path');

function createArticle(title, url, date, author, content, summary) {
  return {
    title,
    url,
    author,
    date,
    content,
    summary
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
      article.author,
      article.date,
      article.content,
      article.summary
    ));
  } catch (error) {
    console.error('Error loading test articles:', error);
    return []; // Return an empty array if there's an error
  }
}

module.exports = { createArticle, loadTestArticles };
