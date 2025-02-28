// Site.js
import React, { useState } from "react";
import "./Site.css";
import ALMImage from "./assets/ALM.avif";
import CNNImage from "./assets/CNN.svg";

const Site = ({ onSiteSelect, fetchArticlesForSite }) => {
  const [selectedSite, setSelectedSite] = useState(null);

  const sites = [
    {
      name: "American Liberty Media",
      url: "https://www.americanlibertymedia.com",
      image: ALMImage,
    },
    { name: "CNN", url: "https://www.cnn.com", image: CNNImage },
  ];

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
              style={{ backgroundImage: `url(${site.image})` }}
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
