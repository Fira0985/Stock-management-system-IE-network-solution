import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiSun, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { uploadProfileImage, getImage } from "../../services/userService";

const Navbar = ({ isSidebarOpen, onProfileClick }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef();
  const data = { email: localStorage.getItem("email") };

  async function fetchImage(data) {
    const response = await getImage(data);
    setAvatar(response.data.imageUrl);
  }

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
    fetchImage(data);
  });

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const result = await uploadProfileImage(file);

        const imageUrl = `http://localhost:3000/${result.user.image_url}`;
        fetchImage(data);
      } catch (err) {
        console.error("Image upload failed:", err.message);
      }
    }
  };

  return (
    <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
      <div className="title">Dashboard</div>
      <div className="topbar-right">
        <Link to="/notification" className="icon">
          <FiBell />
        </Link>
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
