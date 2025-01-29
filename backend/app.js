const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let articles = [];

// Define routes
app.get('/', (req, res) => {
  res.send('Server is running');
});


app.post('/receive-articles', (req, res) => {
  const newArticles = req.body;
  // Update existing articles or add new ones
  newArticles.forEach(newArticle => {
      const index = articles.findIndex(a => a.url === newArticle.url);
      if (index !== -1) {
          articles[index] = newArticle; // Update existing article
      } else {
          articles.push(newArticle); // Add new article
      }
  });
  console.log('Updated articles:', articles);
  res.status(200).json({ message: 'Articles received and updated successfully' });
});

// Route for articles
app.get('/articles', (req, res) => {
  res.json(articles);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
