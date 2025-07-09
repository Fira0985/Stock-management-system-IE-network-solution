import React, { useState } from "react";
import "./settings.css";

const settings = ({ isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  // Example state for user profile
  const [user, setUser] = useState({
    name: "Bemni Endal",
    email: "bemni@example.com",
  });

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="settings-container">
    <div
      className={`settings-page ${
        isSidebarOpen ? "with-sidebar" : "full-width"
      } ${darkMode ? "dark" : ""}`}
    >
      <h2>Settings</h2>

      <nav className="settings-tabs">
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
      <section className="settings-content">
        {activeTab === "profile" && (
          <div className="tab-section">
            <h3>User Profile</h3>
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
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </label>
            <label>
              Password:
              <input type="password" placeholder="Change password" />
            </label>
            <button className="purple-btn">Save Profile</button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="tab-section">
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
          <div className="tab-section">
            <h3>Account Security</h3>
            <label>
              <input type="checkbox" />
              Enable Two-Factor Authentication (2FA) [Placeholder]
            </label>
            <button className="purple-btn">Update Security Settings</button>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="tab-section">
            <h3>Backup & Restore</h3>
            <button className="blue-btn">Export Data</button>
            
          </div>
        )}

        {activeTab === "roles" && (
          <div className="tab-section">
            <h3>Privacy & Logout</h3>
            <button className="purple-btn">Logout</button>
          </div>
        )}


      </section>
    </div>
    </div>
  );
};

export default settings;
