import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AccountSetting.css";

function AccountSetting() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user-profile");
      setUser((prevUser) => ({
        ...prevUser,
        username: response.data.username,
        email: response.data.email,
      }));
    } catch (error) {
      setError("Failed to fetch user data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (user.newPassword !== user.confirmNewPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const response = await axios.put("/api/user-profile", {
        username: user.username,
        email: user.email,
        currentPassword: user.password,
        newPassword: user.newPassword,
      });
      setMessage(response.data.message || "Profile updated successfully");
      setIsEditing(false);
      // Clear password fields
      setUser((prevUser) => ({
        ...prevUser,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        {isEditing && (
          <>
            <div className="form-group">
              <label htmlFor="password">Current Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={user.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={user.confirmNewPassword}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Edit Profile
          </button>
        ) : (
          <button type="submit" className="save-button">
            Save Changes
          </button>
        )}
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AccountSetting;
