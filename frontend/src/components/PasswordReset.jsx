import React, { useState } from "react";
import axios from "axios";
import "../styles/PasswordReset.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/password-reset", { email });
      setMessage(response.data.message || "Password reset link sent!");
      setError(""); // Clear any previous error
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset link");
      setMessage(""); // Clear any previous message
    }
  };

  return (
    <div className="password-reset-wrapper">
      <div className="password-reset-container">
        <form className="password-reset-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send Reset Link</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <div className="home-btn">
        <button onClick={handleGoHome} className="btn-home">
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default PasswordReset;
