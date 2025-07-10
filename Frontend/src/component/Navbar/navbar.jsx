import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiSun, FiMoon, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { uploadProfileImage, getImage } from "../../services/userService";
import { fetchRecentActivity } from "../../services/statisticsApi";

const Navbar = ({ isSidebarOpen, onProfileClick }) => {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [avatar, setAvatar] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(
    sessionStorage.getItem("hasUnread") === "true"
  );
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      document.body.classList.contains("dark")
  );

  const fileInputRef = useRef();
  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("userName");

  const fetchAvatar = async () => {
    try {
      const response = await getImage({ email });
      setAvatar(response.data.imageUrl);
    } catch (error) {
      console.error("Failed to load avatar:", error.message);
    }
  };

  const loadNotifications = async () => {
    try {
      const activity = await fetchRecentActivity();
      const sessionStart = new Date(sessionStorage.getItem("sessionStartTime"));
      const filtered = activity.filter((item) => {
        const createdAt = new Date(item.time);
        return createdAt > sessionStart && item.by !== userName;
      });

      setNotifications(filtered);

      if (filtered.length > 0) {
        setHasUnread(true);
        sessionStorage.setItem("hasUnread", "true");
      }
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
  };

  useEffect(() => {
    // Initialize session start time once per session
    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", new Date().toISOString());
    }

    fetchAvatar();
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Set initial theme on mount
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // Update theme when darkMode changes
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        await uploadProfileImage(file);
        fetchAvatar();
      } catch (err) {
        console.error("Image upload failed:", err.message);
      }
    }
  };

  const toggleDropdown = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (newState === true) {
      // When dropdown is shown, clear unread badge
      setHasUnread(false);
      sessionStorage.setItem("hasUnread", "false");
      sessionStorage.setItem("lastReadTime", new Date().toISOString());
    }
  };

  return (
    <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
      <div className="title">Dashboard</div>
      <div className="topbar-right">
        {/* Notifications */}
        <div className="icon notification-wrapper" onClick={toggleDropdown}>
          <FiBell />
          {hasUnread && (
            <span className="notification-badge">{notifications.length}</span>
          )}
          {showDropdown && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              <ul>
                {notifications.length === 0 ? (
                  <li>No new notifications</li>
                ) : (
                  notifications.map((item, index) => (
                    <li key={index}>
                      <strong>{item.type}</strong>: {item.description}
                      <br />
                      <small>{new Date(item.time).toLocaleTimeString()}</small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Theme toggle icon */}
        <span
          className="icon"
          onClick={() => setDarkMode((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </span>

        {/* Avatar */}
        <div className="avatar small" onClick={handleAvatarClick}>
          {avatar ? (
            <img
              src={`http://localhost:3000/${avatar}`}
              alt="User Avatar"
              className="avatar-img"
            />
          ) : (
            <span className="default-avatar">
              <FiUser />
            </span>
          )}
        </div>

        {/* Username */}
        {name && (
          <span className="username" onClick={onProfileClick}>
            {name}
          </span>
        )}

        {/* Hidden file input for image upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
    </header>
  );
};

export default Navbar;
