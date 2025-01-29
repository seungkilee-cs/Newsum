import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>News Summarizer</h1>
      </header>
      <main className="article-grid">
        {articles.slice(0, 10).map((article, index) => (
          <article key={article._id} className={`article-card rank-${index + 1}`}>
            <div className="article-header">
              <span className="article-number">{index + 1}</span>
              {index < 3 && <span className="trending-tag">Trending</span>}
            </div>
            <h2 className="article-title">{article.title}</h2>
            <ul className="article-summary">
              {article.summary.map((point, pointIndex) => (
                <li key={pointIndex} className="summary-point">{point}</li>
              ))}
            </ul>
            <a href={article.url} className="read-more" target="_blank" rel="noopener noreferrer">Read More</a>
          </article>
        ))}
      </main>
    </div>
  );
  
}

export default App;
