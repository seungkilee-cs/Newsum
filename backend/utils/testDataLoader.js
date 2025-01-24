const fs = require('fs');
const path = require('path');

function loadSampleArticle() {
  const filePath = path.join(__dirname, '..', '_test', 'sample_article.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading sample article:', error);
    return null;
  }
}

module.exports = {
  loadSampleArticle
};
