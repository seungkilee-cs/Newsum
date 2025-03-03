import React, { useState, useCallback } from "react";
import CarouselView from "./components/CarouselView";
import Site from "./components/Site";
import "./styles/App.css";
import { fetchArticles } from "./services/articleService";

function App() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);

  const fetchArticlesForSite = useCallback(async (site) => {
    const fetchedArticles = await fetchArticles(site);
    setArticles(fetchedArticles);
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
