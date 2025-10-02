import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import the CSS file
import { registerUser } from "../services/authService";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUser({
        username,
        email,
        password,
      });
      setSuccessMessage(response.message || "Account created successfully");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      if (error.response?.data?.issues?.length) {
        setError(error.response.data.issues[0].message);
      } else {
        setError(error.response?.data?.message || "Registration failed");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="reigster-wrapper">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            aria-label="Username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            aria-label="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            aria-label="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="success-message" role="status">
              {successMessage}
            </p>
          )}
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

export default CreateAccount;
