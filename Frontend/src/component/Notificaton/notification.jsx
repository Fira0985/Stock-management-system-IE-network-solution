import React, { useState } from "react";
import "./notification.css";

const notification = ({ isSidebarOpen }) => {
  const [prefs, setPrefs] = useState({
    enabled: true,
    email: true,
    inApp: false,
    summary: false,
  });

  const handleChange = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert("Preferences saved!");
  };

  return (
    <div
      className={`notification-page ${
        isSidebarOpen ? "with-sidebar" : "full-width"
      }`}
    >
      <h2>🔔 Notification Settings</h2>

      <div className="notification-options">
        <label>
          <input
            type="checkbox"
            checked={prefs.enabled}
            onChange={() => handleChange("enabled")}
          />
          Enable All Notifications
        </label>

        <label>
          <input
            type="checkbox"
            checked={prefs.email}
            onChange={() => handleChange("email")}
            disabled={!prefs.enabled}
          />
          Email Notifications
        </label>

        <label>
          <input
            type="checkbox"
            checked={prefs.inApp}
            onChange={() => handleChange("inApp")}
            disabled={!prefs.enabled}
          />
          In-App Notifications
        </label>

        <label>
          <input
            type="checkbox"
            checked={prefs.summary}
            onChange={() => handleChange("summary")}
            disabled={!prefs.enabled}
          />
          Daily Summary Email
        </label>

        <button className="purple-btn" onClick={handleSave}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default notification;
