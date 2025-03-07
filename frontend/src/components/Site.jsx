import React, { useState } from "react";
import "../styles/Site.css";
import sites from "../data/siteData";

const Site = ({ onSiteSelect, fetchArticlesForSite }) => {
  const [selectedSite, setSelectedSite] = useState(null);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    onSiteSelect(site);
    fetchArticlesForSite(site);
  };

  return (
    <div className="site-selector">
      <h2>Choose a News Site</h2>
      <div className="site-grid">
        {sites.map((site, index) => (
          <div
            key={index}
            className={`site-card ${selectedSite === site ? "selected" : ""}`}
            onClick={() => handleSiteSelect(site)}
          >
            <div
              className="site-image"
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/${site.image})`,
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
        ))}
      </div>
    </div>
  );
};

export default Site;
