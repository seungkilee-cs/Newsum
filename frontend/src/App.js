import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CarouselView from "./CarouselView";
import Site from "./Site";
import "./App.css";
import mockArticles from "./_test/mockData";
import normalizeUrl from 'normalize-url';

const isStaging = process.env.REACT_APP_ENVIRONMENT === "staging";
const test = true;

function App() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);

  const fetchArticles = useCallback(async () => {
    if (!selectedSite) return;

    try {
      let fetchedArticles = [];

      if (isStaging) {
        fetchedArticles = mockArticles;
      } else {
        let articleEndpoint = "";
        if (test) {
          articleEndpoint = "http://localhost:5001/mongo-articles";
        } else {
          articleEndpoint = "http://localhost:5001/articles";
        }
        const response = await axios.get(articleEndpoint);
        fetchedArticles = response.data;
      }

      // Filter articles based on the selected site
      const filteredArticles = fetchedArticles.filter(
        (article) => normalizeUrl(article.site) === normalizeUrl(selectedSite.url)
      );
      setArticles(filteredArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, [selectedSite]);

  useEffect(() => {
    if (selectedSite) {
      fetchArticles();
    }
  }, [selectedSite, fetchArticles]);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    setView("carousel");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>News Summarizer</h1>
        {view !== "site" && (
          <button onClick={() => setView("site")} className="view-toggle-btn">
            Change Site
          </button>
        )}
      </header>
      {view === "site" ? (
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
