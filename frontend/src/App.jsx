import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PasswordReset from "./components/PasswordReset";
import AccountSetting from "./components/AccountSetting";
import Site from "./components/Site";
import CarouselView from "./components/CarouselView";
import { fetchSites } from "./services/siteService";
import "./styles/App.css";

function App() {
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(() => {
    const storedSite = localStorage.getItem("selectedSite");
    return storedSite ? JSON.parse(storedSite) : null;
  });

  useEffect(() => {
    const loadSites = async () => {
      try {
        const fetchedSites = await fetchSites();
        setSites(fetchedSites);
      } finally {
        setSitesLoading(false);
      }
    };
    loadSites();
  }, []);

  useEffect(() => {
    if (!sites.length) {
      return;
    }

    if (!selectedSite) {
      const storedSite = localStorage.getItem("selectedSite");
      if (storedSite) {
        try {
          const parsedSite = JSON.parse(storedSite);
          const matchedSite = sites.find((site) => site.url === parsedSite.url);
          if (matchedSite) {
            setSelectedSite(matchedSite);
          }
        } catch (error) {
          console.error("Failed to parse stored site", error);
        }
      }
      return;
    }

    const matchedSite = sites.find((site) => site.url === selectedSite.url);
    if (!matchedSite) {
      setSelectedSite(null);
      localStorage.removeItem("selectedSite");
    } else if (matchedSite !== selectedSite) {
      setSelectedSite(matchedSite);
      localStorage.setItem("selectedSite", JSON.stringify(matchedSite));
    }
  }, [sites, selectedSite]);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    localStorage.setItem("selectedSite", JSON.stringify(site));
  };

  const getSelectedSiteFromURL = (siteName) => {
    if (!sites.length) return null;
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
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          {/* <Route path="/account-setting" element={<AccountSetting />} /> */}
          <Route
            path="/sites"
            element={
              <Site
                sites={sites}
                onSiteSelect={handleSiteSelect}
                isLoading={sitesLoading}
              />
            }
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
    navigate("/sites");
  };

  return (
    <header className="header">
      {isInSiteView && (
        <nav>
          <button onClick={handleChangeSite} className="view-toggle-btn">
            Change Sites
          </button>
        </nav>
      )}
    </header>
  );
}

export default App;
