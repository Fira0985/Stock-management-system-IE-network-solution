import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiBell, FiSun, FiMoon, FiUser } from "react-icons/fi";
import "./Navbar.css";
import {
  uploadProfileImage,
  getImage,
} from "../../services/userService";
import { fetchRecentActivity } from "../../services/statisticsApi";

const Navbar = ({ isSidebarOpen, onProfileClick }) => {
  /* ───────────── Local state ───────────── */
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

  /* ───────────── Helpers ───────────── */
  const fetchAvatar = useCallback(async () => {
    try {
      const { data } = await getImage({ email });
      setAvatar(data.imageUrl);
    } catch (err) {
      console.error("Failed to load avatar:", err.message);
    }
  }, [email]);

  const loadNotifications = useCallback(async () => {
    try {
      const activity = await fetchRecentActivity();
      const sessionStart = new Date(
        sessionStorage.getItem("sessionStartTime")
      );
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
  }, [userName]);

  /* ───────────── Initial mount ───────────── */
  useEffect(() => {
    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", new Date().toISOString());
    }
    fetchAvatar();
    loadNotifications();

    const interval = setInterval(loadNotifications, 30_000); // every 30 s
    return () => clearInterval(interval);
  }, [fetchAvatar, loadNotifications]);

  /* ───────────── Theme sync ───────────── */
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ───────────── Listen for profile updates ───────────── */
  useEffect(() => {
    const handleProfileClosed = () => {
      setName(localStorage.getItem("userName") || "");
      fetchAvatar();
    };
    window.addEventListener("profileClosed", handleProfileClosed);
    return () =>
      window.removeEventListener("profileClosed", handleProfileClosed);
  }, [fetchAvatar]);

  /* ───────────── Handlers ───────────── */
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return;
    try {
      await uploadProfileImage(file);
      fetchAvatar();
    } catch (err) {
      console.error("Image upload failed:", err.message);
    }
  };

  const toggleDropdown = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (newState) {
      setHasUnread(false);
      sessionStorage.setItem("hasUnread", "false");
    }
  };

  /* ───────────── Render ───────────── */
  return (
    <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
      <div className="title">Dashboard</div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="icon notification-wrapper" onClick={toggleDropdown}>
          <FiBell />
          {hasUnread && (
            <span className="notification-badge">
              {notifications.length}
            </span>
          )}
          {showDropdown && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              <ul>
                {notifications.length === 0 ? (
                  <li>No new notifications</li>
                ) : (
                  notifications.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.type}</strong>: {item.description}
                      <br />
                      <small>
                        {new Date(item.time).toLocaleTimeString()}
                      </small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        {/* <span
          className="icon"
          onClick={() => setDarkMode((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </span> */}

        {/* Avatar */}
        <div className="avatar small" onClick={handleAvatarClick}>
          {avatar ? (
            <img
              src={`http://localhost:3000/${avatar}`}
              alt="Avatar"
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

        {/* Hidden file input */}
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

