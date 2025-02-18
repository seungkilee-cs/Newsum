import React, { useState, useEffect } from "react";
import axios from "axios";
import CarouselView from "./CarouselView";
import Site from "./Site";
import "./App.css";

const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
// const test = !isStaging && process.env.NODE_ENV !== 'production';
const test = true;

function App() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState('site');
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    if (selectedSite) {
      fetchArticles();
    }
  }, [selectedSite]);

  const fetchArticles = async () => {
    try {
      if (isStaging) {
        const { default: mockArticles } = await import('./mockData');
        setArticles(mockArticles);
      } else {
        let articleEndpoint = "";
        if (test) {
          articleEndpoint = "http://localhost:5001/mongo-articles";
        } else {
          articleEndpoint = "http://localhost:5001/articles";
        }
        const response = await axios.get(articleEndpoint);
        setArticles(response.data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    setView('carousel');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>News Summarizer</h1>
        {view !== 'site' && (
          <button onClick={() => setView('site')} className="view-toggle-btn">
            Change Site
          </button>
        )}
      </header>
      {view === 'site' ? (
        <Site onSiteSelect={handleSiteSelect} />
      ) : articles.length > 0 ? (
        <CarouselView articles={articles} />
      ) : (
        <p>Loading articles...</p>
      )}
    </div>
  );
}

export default App;
