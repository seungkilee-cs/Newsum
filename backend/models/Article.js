import mongoose from "mongoose";
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  author: String,
  publishDate: Date,
  content: [String],
  summary: [String],
  imageUrl: String,
  url: String,
  site: String,
});

export default articleSchema;
