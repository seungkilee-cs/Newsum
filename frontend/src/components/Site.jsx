import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Site.css";

const Site = ({ sites, onSiteSelect, isLoading = false }) => {
  const navigate = useNavigate();

  const handleSiteSelect = (site) => {
    // Format the site name: convert to lowercase and replace spaces with hyphens
    const formattedSiteName = site.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/site/${encodeURIComponent(formattedSiteName)}`);
    // navigate(`/site/${encodeURIComponent(site.name)}`);
    onSiteSelect(site);
  };
  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading sites...</div>;
  }

  if (!sites || sites.length === 0) {
    return <div>No sites available. Please try again later.</div>;
  }

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
                backgroundImage: `url(${site.image?.startsWith("http") ? site.image : `${import.meta.env.BASE_URL}assets/${site.image}`})`,
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
      <div className="home-btn">
        <button onClick={handleGoHome} className="btn-home">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Site;
