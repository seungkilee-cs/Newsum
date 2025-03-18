import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Site.css";

const Site = ({ sites, onSiteSelect }) => {
  const navigate = useNavigate();

  const handleSiteSelect = (site) => {
    onSiteSelect(site);
    navigate(`/site/${encodeURIComponent(site.name)}`);
  };

  if (!sites || sites.length === 0) return <div>Loading sites...</div>;

  return (
    <div className="site-selector">
      <h2>Your News Site</h2>
      <div className="site-grid">
        {sites.map((site, index) => (
          <div
            key={site._id || index}
            className="site-card"
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
