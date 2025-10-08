import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiBell, FiSun, FiMoon, FiUser, FiMenu } from "react-icons/fi";
import { io } from "socket.io-client";
import "./Navbar.css";
import { uploadProfileImage, getImage } from "../../services/userService";
import { getUserNotifications } from "../../services/notificationService";

const socket = io("http://localhost:3000", { withCredentials: true });

const Navbar = ({ isSidebarOpen, onProfileClick, onHamburgerClick }) => {
  /* ───────────── Local state ───────────── */
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [avatar, setAvatar] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

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

  const getLastVisitTime = () => new Date(localStorage.getItem("lastVisitTime") || 0);

  const handleIncomingActivity = useCallback(
    (activity) => {
      const normalizedUserName = userName?.trim().toLowerCase();
      const filtered = activity.filter(
        (item) => item.by?.trim().toLowerCase() !== normalizedUserName
      );
      setNotifications(filtered);

      // Only set hasUnread if there are notifications after lastVisitTime
      const lastVisit = getLastVisitTime();
      const hasNew = filtered.some(item => new Date(item.at) > lastVisit);
      setHasUnread(hasNew);
      localStorage.setItem("hasUnread", hasNew ? "true" : "false");
    },
    [userName]
  );

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getUserNotifications(email);
      handleIncomingActivity(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err.message);
    }
  }, [email, handleIncomingActivity]);

  /* ───────────── Initial mount ───────────── */
  useEffect(() => {
    // Set last visit if not set
    if (!localStorage.getItem("lastVisitTime")) {
      localStorage.setItem("lastVisitTime", new Date().toISOString());
    }

    fetchAvatar();
    fetchNotifications();

    // Listen for socket.io events
    socket.on("recentActivity", handleIncomingActivity);

    return () => {
      socket.off("recentActivity", handleIncomingActivity);
    };
  }, [fetchAvatar, fetchNotifications, handleIncomingActivity]);

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
      localStorage.setItem("hasUnread", "false");
      localStorage.setItem("lastVisitTime", new Date().toISOString());
    }
  };

  /* ───────────── Render ───────────── */
  return (
    <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
      <div className="title">Dashboard</div>
      <span className="hamburger-btn" onClick={onHamburgerClick}>
        <FiMenu size={22} />
      </span>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="icon notification-wrapper" onClick={toggleDropdown}>
          <FiBell />
          {hasUnread && <span className="notification-badge">{notifications.filter(item => new Date(item.at) > getLastVisitTime()).length}</span>}
          {showDropdown && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              <ul>
                {notifications.length === 0 ? (
                  <li>No new notifications</li>
                ) : (
                  notifications.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.type}</strong>: {item.description || item.customer || item.supplier}
                      <br />
                      <small>{new Date(item.at).toLocaleTimeString()}</small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="avatar small" onClick={handleAvatarClick}>
          {avatar ? (
            <img src={`http://localhost:3000/${avatar}`} alt="Avatar" className="avatar-img" />
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
