const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { loadTestArticles } = require('./models/Article');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load test articles
const testArticles = loadTestArticles();

// Define routes
app.get('/', (req, res) => {
  res.send('News Summarizer API');
});

// Route for articles
app.get('/articles', (req, res) => {
  res.json(testArticles);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
