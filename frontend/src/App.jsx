import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Site from "./components/Site";
import CarouselView from "./components/CarouselView";
import { fetchSites } from "./services/siteService"; // Assume this exists
import "./styles/App.css";

function App() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(() => {
    // Retrieve the selected site from localStorage on initial load
    const storedSite = localStorage.getItem("selectedSite");
    return storedSite ? JSON.parse(storedSite) : null;
  });

  useEffect(() => {
    const loadSites = async () => {
      const fetchedSites = await fetchSites();
      setSites(fetchedSites);
    };
    loadSites();
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    localStorage.setItem("selectedSite", JSON.stringify(site)); // Persist the selected site in localStorage
  };

  const getSelectedSiteFromURL = (siteName) => {
    if (!sites.length) return null;

    // Find the site object that matches the normalized siteName
    const normalizedSiteName = siteName.toLowerCase().replace(/-/g, " ");
    return sites.find(
      (site) =>
        site.name.toLowerCase().replace(/\s+/g, " ") === normalizedSiteName,
    );
  };

  return (
    <Router basename="/Newsum/">
      <div className="app">
        <Header />
        <Routes>
          {/* Redirect to lowercase and hyphenated URLs */}
          <Route path="/Newsum/" />

          <Route
            path="/"
            element={<Site sites={sites} onSiteSelect={handleSiteSelect} />}
          />
          <Route
            path="/site/:siteName"
            element={
              <CarouselView
                site={selectedSite}
                getSelectedSiteFromURL={getSelectedSiteFromURL}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isInSiteView = location.pathname.startsWith("/site/");

  const handleChangeSite = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <h1>News Summarizer</h1>
      {isInSiteView && (
        <nav>
          <button onClick={handleChangeSite} className="view-toggle-btn">
            Change Site
          </button>
        </nav>
      )}
    </header>
  );
}

export default App;
