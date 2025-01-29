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
      <main className="article-list">
        {articles.map(article => (
          <article key={article._id} className="article-card">
            <h2 className="article-title">{article.title}</h2>
            <ul className="article-summary">
              {article.summary.map((point, index) => (
                <li key={index} className="summary-point">{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </main>
    </div>
  );
  
}

export default App;
