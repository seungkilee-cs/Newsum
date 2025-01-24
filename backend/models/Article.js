const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  url: String,
  author: String,
  img: String,
  content: String,
  summary: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
