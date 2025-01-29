const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { loadTestArticles } = require('./models/Article');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
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

app.post('/receive-articles', (req, res) => {
  const articles = req.body;
  console.log('Received articles from scraper:', articles);
  // Here you would typically process and store the articles
  // For now, we'll just acknowledge receipt
  res.status(200).json({ message: 'Articles received successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
