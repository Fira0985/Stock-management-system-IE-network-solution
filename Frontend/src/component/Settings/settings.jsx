import React, { useState, useEffect } from "react";
import "./settings.css";
import { getUserByEmail, editUser, changePassword } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const Settings = ({ isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      document.body.classList.contains("dark")
  );

  // User state from DB
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setProfileMsg("");
      try {
        const email = localStorage.getItem("email");
        const data = await getUserByEmail(email);
        setUser({
          name: data.username || "",
          email: data.email || "",
          password: "",
        });
        setPassword("");
      } catch (err) {
        setProfileMsg("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "profile") fetchProfile();
  }, [activeTab]);

  // Sync dark mode with body and localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleProfileSave = async () => {
    setProfileMsg("");
    setLoading(true);
    try {
      await editUser({
        email: user.email,
        username: user.name,
      });
      setProfileMsg("Profile updated successfully.");
      localStorage.setItem("userName", user.name);
    } catch (err) {
      setProfileMsg("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMsg("");
    if (!password || password.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await changePassword({ email: user.email, password });
      setPasswordMsg("Password updated successfully.");
      setPassword("");
    } catch (err) {
      setPasswordMsg("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`settings-page-container ${darkMode ? "dark" : ""}`}>
      <div className={`settings-sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
        <h2>Settings</h2>
        <nav className="settings-nav">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <i className="icon-user"></i>
            <span>Profile</span>
          </button>
          <button
            className={activeTab === "preferences" ? "active" : ""}
            onClick={() => setActiveTab("preferences")}
          >
            <i className="icon-settings"></i>
            <span>Preferences</span>
          </button>
          <button
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            <i className="icon-lock"></i>
            <span>Security</span>
          </button>
          <button
            className={activeTab === "backup" ? "active" : ""}
            onClick={() => setActiveTab("backup")}
          >
            <i className="icon-database"></i>
            <span>Backup</span>
          </button>
          <button
            className={activeTab === "roles" ? "active" : ""}
            onClick={() => setActiveTab("roles")}
          >
            <i className="icon-logout"></i>
            <span>Privacy & Logout</span>
          </button>
        </nav>
      </div>

      <div className="settings-content">
        {activeTab === "profile" && (
          <div className="tab-section">
            <h3>User Profile</h3>
            {loading && <div className="loading">Loading...</div>}
            {profileMsg && <div className={`message ${profileMsg.includes("success") ? "success" : "error"}`}>{profileMsg}</div>}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={user.email}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Change password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={handlePasswordChange}
                disabled={loading}
              >
                Change Password
              </button>
              <button className="btn btn-primary" onClick={handleProfileSave} disabled={loading}>
                Save Profile
              </button>
            </div>
            {passwordMsg && <div className={`message ${passwordMsg.includes("success") ? "success" : "error"}`}>{passwordMsg}</div>}
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="tab-section">
            <h3>Preferences</h3>
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <label htmlFor="darkMode">Enable Dark Mode</label>
            </div>
            <div className="form-group">
              <label>Default Currency:</label>
              <select>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>ETB (Br)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format:</label>
              <select>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="tab-section">
            <h3>Account Security</h3>
            <div className="form-group checkbox">
              <input type="checkbox" id="2fa" />
              <label htmlFor="2fa">Enable Two-Factor Authentication (2FA)</label>
            </div>
            <button className="btn btn-primary">Update Security Settings</button>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="tab-section">
            <h3>Backup & Restore</h3>
            <button className="btn btn-primary">Export Data</button>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="tab-section">
            <h3>Privacy & Logout</h3>
            <button className="btn btn-danger" onClick={() => setShowLogoutModal(true)}>Logout</button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="form-actions">
              <button className="btn btn-danger" onClick={handleLogout}>Yes, Logout</button>
              <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;