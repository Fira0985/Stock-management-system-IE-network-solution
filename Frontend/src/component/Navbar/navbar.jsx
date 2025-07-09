import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiSun, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { uploadProfileImage, getImage } from "../../services/userService";
import { fetchRecentActivity } from "../../services/statisticsApi";

const Navbar = ({ isSidebarOpen, onProfileClick }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef();
  const [hasUnread, setHasUnread] = useState(() => {
    return sessionStorage.getItem("hasUnread") === "true";
  });



  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("userName");
  const data = { email };

  // Store session start time
  if (!sessionStorage.getItem("sessionStartTime")) {
    sessionStorage.setItem("sessionStartTime", new Date().toISOString());
  }

  async function fetchImage(data) {
    const response = await getImage(data);
    setAvatar(response.data.imageUrl);
  }

  const loadNotifications = async () => {
    try {
      const activity = await fetchRecentActivity();
      const sessionStart = new Date(sessionStorage.getItem("sessionStartTime"));
      const lastRead = new Date(sessionStorage.getItem("lastReadTime") || 0);

      const filtered = activity.filter((item) => {
        const createdAt = new Date(item.time);
        return createdAt > sessionStart && item.by !== userName;
      });

      setNotifications(filtered);

      // Show badge only if any notification is newer than last read
      const hasNew = filtered.some(item => new Date(item.time) > lastRead);
      setHasUnread(hasNew);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
  };


  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
    fetchImage(data);
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const result = await uploadProfileImage(file);
        fetchImage(data);
      } catch (err) {
        console.error("Image upload failed:", err.message);
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    if (!showDropdown) {
      const now = new Date().toISOString();
      sessionStorage.setItem("lastReadTime", now);
      setHasUnread(false);
    }
  };




  return (
    <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
      <div className="title">Dashboard</div>
      <div className="topbar-right">
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

        <span className="icon">
          <FiSun />
        </span>

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

        {name && (
          <span className="username" onClick={onProfileClick}>
            {name}
          </span>
        )}

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
