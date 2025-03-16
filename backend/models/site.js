import mongoose from "mongoose";
import articleSchema from "./article.js";

const { Schema } = mongoose;

const siteSchema = new Schema({
  name: String,
  url: String,
  image: String,
  articles: [articleSchema],
});

export default siteSchema;
