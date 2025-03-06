const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleSchema = require("./article");

const siteSchema = new Schema({
  name: String,
  url: String,
  image: String,
  articles: [articleSchema],
});

// const Site = mongoose.model('Site', siteSchema);
// module.exports = Site;
module.exports = siteSchema;
