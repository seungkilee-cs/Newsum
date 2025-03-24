import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h2>AI Powered News Summarizer for You</h2>
      <nav>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/password-reset">Password Reset</Link>
        <Link to="/sites">Continue without Account</Link>
      </nav>
    </div>
  );
}

export default Home;
