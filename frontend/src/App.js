// App.js
import React, { useState, useCallback } from "react";
import axios from "axios";
import CarouselView from "./CarouselView";
import Site from "./Site";
import "./App.css";
import normalizeUrl from "normalize-url";
import mockArticles from "./_test/mockData";

const isStaging = process.env.REACT_APP_ENVIRONMENT === "staging";
const test = true;

function App() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);

  const fetchArticlesForSite = useCallback(async (site) => {
    try {
      let fetchedArticles = [];
      let articleEndpoint =
        isStaging || test
          ? "http://localhost:5001/mongo-articles"
          : "http://localhost:5001/articles";

      const response = await axios.get(articleEndpoint, {
        params: { site: normalizeUrl(site.url) },
      });
      if (isStaging) {
        fetchedArticles = mockArticles;
      } else {
        fetchedArticles = response.data;
      }

      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    }
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    fetchArticlesForSite(site);
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
        <Site
          onSiteSelect={handleSiteSelect}
          fetchArticlesForSite={fetchArticlesForSite}
        />
      ) : articles.length > 0 ? (
        <CarouselView articles={articles} />
      ) : (
        <p>Loading articles...</p>
      )}
    </div>
  );
}

export default App;
