import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="App">
      <h1>News Summarizer</h1>
      {articles.map(article => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <ul>
            {article.summary.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
