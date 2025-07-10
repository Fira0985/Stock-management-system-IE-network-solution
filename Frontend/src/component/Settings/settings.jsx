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
        // password: user.password, // Only send if you want to update password
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
    <div className={isSidebarOpen ? "st-settings-container" : "st-settings-container collapse"}>
      <div
        className={`st-settings-page ${isSidebarOpen ? "with-sidebar" : "full-width"
          } ${darkMode ? "dark" : ""}`}
      >
        <h2>Settings</h2>

        <nav className="st-settings-tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "preferences" ? "active" : ""}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button
            className={activeTab === "backup" ? "active" : ""}
            onClick={() => setActiveTab("backup")}
          >
            Backup & Restore
          </button>
          <button
            className={activeTab === "roles" ? "active" : ""}
            onClick={() => setActiveTab("roles")}
          >
            Privacy & Logout
          </button>
        </nav>
      </div>

      <div>
        <section className="st-settings-content">
          {activeTab === "profile" && (
            <div className="st-tab-section">
              <h3>User Profile</h3>
              {loading && <div>Loading...</div>}
              {profileMsg && <div style={{ color: profileMsg.includes("success") ? "green" : "red" }}>{profileMsg}</div>}
              <label>
                Name:
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ background: "#eee" }}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  placeholder="Change password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
              <button
                className="st-purple-btn"
                onClick={handlePasswordChange}
                disabled={loading}
                style={{ marginBottom: 8 }}
              >
                Change Password
              </button>
              {passwordMsg && <div style={{ color: passwordMsg.includes("success") ? "green" : "red" }}>{passwordMsg}</div>}
              <button className="st-purple-btn" onClick={handleProfileSave} disabled={loading}>
                Save Profile
              </button>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="st-tab-section">
              <h3>Preferences</h3>
              <label>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                Enable Dark Mode
              </label>
              <label>
                Default Currency:
                <select>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>ETB (Br)</option>
                </select>
              </label>
              <label>
                Date Format:
                <select>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                </select>
              </label>
            </div>
          )}

          {activeTab === "security" && (
            <div className="st-tab-section">
              <h3>Account Security</h3>
              <label>
                <input type="checkbox" />
                Enable Two-Factor Authentication (2FA) [Placeholder]
              </label>
              <button className="st-purple-btn">Update Security Settings</button>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="st-tab-section">
              <h3>Backup & Restore</h3>
              <button className="st-blue-btn">Export Data</button>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="st-tab-section">
              <h3>Privacy & Logout</h3>
              <button className="st-purple-btn" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          )}
        </section>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="form-actions">
              <button onClick={handleLogout}>Yes, Logout</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
