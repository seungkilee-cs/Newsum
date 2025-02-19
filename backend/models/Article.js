const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  author: String,
  publishDate: Date,
  content: [String],
  summary: [String],
  imageUrl: String,
  url: String,
  site: String
});


// const Article = mongoose.model('Article', articleSchema);
// module.exports = Article;

module.exports = articleSchema;