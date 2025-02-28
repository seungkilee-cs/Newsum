import React, { useState, useCallback } from "react";
import axios from "axios";
import CarouselView from "./CarouselView";
import Site from "./Site";
import "./App.css";
import normalizeUrl from "normalize-url";
import mockArticles from "./_test/mockData";

const isStaging = import.meta.env.VITE_APP_ENVIRONMENT === "staging";
const test = true;

function App() {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState("site");
  const [selectedSite, setSelectedSite] = useState(null);

  const fetchArticlesForSite = useCallback(
    async (site) => {
      try {
        let fetchedArticles = [];

        if (isStaging) {
          console.log("Using mock data in staging environment");
          fetchedArticles = mockArticles;
        } else {
          console.log("Fetching data from backend");
          let articleEndpoint = test
            ? "http://localhost:5001/mongo-articles"
            : "http://localhost:5001/articles";

          console.log(`Sending request to: ${articleEndpoint}`);
          const response = await axios.get(articleEndpoint);
          console.log("Response received:", response);

          if (response.data && Array.isArray(response.data)) {
            fetchedArticles = response.data;
          } else {
            console.error("Unexpected data format received:", response.data);
            throw new Error("Unexpected data format");
          }
        }

        // console.log("Fetched articles:", fetchedArticles);

        const normalizedSelectedSiteUrl = site?.url
          ? normalizeUrl(site.url)
          : null; // Normalize selected site URL

        const filteredArticles = fetchedArticles.filter((article) => {
          const normalizedArticleSite = article.site
            ? normalizeUrl(article.site)
            : null;

          return normalizedArticleSite === normalizedSelectedSiteUrl;
        });

        // console.log("Filtered articles:", filteredArticles);

        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        setArticles([]);
      }
    },
    [], // Removed 'site' from useCallback dependencies
  );

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
