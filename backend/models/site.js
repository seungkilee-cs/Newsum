import mongoose from "mongoose";
const { Schema } = mongoose;

const siteSchema = new Schema({
  name: String,
  url: String,
  image: String,
  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }], // Reference the Article model
});

// Create and export the Mongoose model
const Site = mongoose.model("Site", siteSchema);
export default Site;
