import React, { useState, useEffect } from "react";
import "../styles/Site.css";
import { fetchSites } from "../services/siteService";

const Site = ({ onSiteSelect, fetchArticlesForSite }) => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const fetchedSites = await fetchSites();
        console.log("Fetched sites:", fetchedSites); // Log fetched sites
        setSites(fetchedSites);
      } catch (err) {
        console.error("Error loading sites:", err);
        setError("Failed to load sites. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSites();
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    onSiteSelect(site);
    fetchArticlesForSite(site);
  };

  if (isLoading) return <div>Loading sites...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="site-selector">
      <h2>Choose a News Site</h2>
      <div className="site-grid">
        {sites.map((site, index) => {
          const imageUrl = `${import.meta.env.BASE_URL}${site.image}`;
          // console.log(
          //   `Site: ${site.name},
          //   Image URL: $../assets${imageUrl},
          //   backgroundImage: url(${import.meta.env.BASE_URL}assets/${site.image}),
          //   BASE_URL: ${import.meta.env.BASE_URL}
          //   `,
          // );
          return (
            <div
              key={site._id || index}
              className={`site-card ${selectedSite === site ? "selected" : ""}`}
              onClick={() => handleSiteSelect(site)}
            >
              <div
                className="site-image"
                style={{
                  backgroundImage: `url(src/assets/${site.image})`,
                }}
              ></div>

              <div className="site-info">
                <h3>{site.name}</h3>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Site
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Site;
