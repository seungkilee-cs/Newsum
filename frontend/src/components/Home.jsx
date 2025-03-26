import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Make sure to create this CSS file

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>NewSum</h1>
        <p>AI-Powered News Summarizer</p>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <h2>Stay Informed, Save Time</h2>
          <p>
            Get concise, AI-generated summaries of the latest news from your
            favorite sources.
          </p>
        </section>

        <section className="action-section">
          <div className="auth-actions">
            <h3>Get Started</h3>
            <Link to="/register" className="btn btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/password-reset" className="btn btn-text">
              Forgot Password?
            </Link>
          </div>
          <div className="guest-action">
            <h3>Explore Now</h3>
            <Link to="/sites" className="btn btn-outline">
              Continue as Guest
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2025 NewSum. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
