import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
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
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const loadSites = async () => {
      const fetchedSites = await fetchSites();
      setSites(fetchedSites);
    };
    loadSites();
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
  };

  return (
    <Router basename="/Newsum">
      <div className="app">
        <Header />
        <Routes>
          <Route path="/Newsum" element={<Navigate to="/Newsum/" replace />} />

          <Route
            path="/"
            element={<Site sites={sites} onSiteSelect={handleSiteSelect} />}
          />
          <Route
            path="/site/:siteName"
            element={<CarouselView site={selectedSite} />}
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
