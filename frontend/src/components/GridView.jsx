// GridView.js
import React from "react";
import "../styles/GridView.css";

function GridView({ articles }) {
  return (
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
              <li key={pointIndex} className="summary-point">
                {point}
              </li>
            ))}
          </ul>
          <a
            href={article.url}
            className="read-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More
          </a>
        </article>
      ))}
    </main>
  );
}

export default GridView;
