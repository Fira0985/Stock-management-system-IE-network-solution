import React, { useState, useEffect } from "react";
import "./navbar.css";
import {
	Bell,
	User,
	Menu,
	Sun,
	Moon,
	Search,
	ChevronDown,
	Info,
	Package,
	AlertTriangle
} from "lucide-react";
import api from "../../services/api";

const Navbar = ({ isSidebarOpen, onProfileClick, onHamburgerClick }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const username = localStorage.getItem("username") || "User";
	const role = localStorage.getItem("role") || "Staff";

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
		document.body.classList.toggle("dark");
	};

	return (
		<nav className={`navbar ${isSidebarOpen ? "" : "expanded"}`}>
			<div className="navbar-left">
				<button className="mobile-menu-btn" onClick={onHamburgerClick}>
					<Menu size={24} />
				</button>
				<div className="nav-search-wrapper">
					<Search size={18} className="search-icon" />
					<input type="text" placeholder="Search SKU, Product, Location..." className="nav-search" />
					<div className="search-shortcut">⌘K</div>
				</div>
			</div>

			<div className="navbar-right">
				{/* Quick Stats Bar */}
				<div className="nav-quick-stats">
					<div className="nav-stat-item">
						<Package size={16} className="stat-icon" />
						<span>SKUs: <strong>1,280</strong></span>
					</div>
					<div className="nav-stat-item warning">
						<AlertTriangle size={16} className="stat-icon" />
						<span>Low: <strong className="text-warning">12</strong></span>
					</div>
				</div>

				<div className="nav-actions">
					<button className="nav-action-btn" onClick={toggleTheme} title="Toggle Theme">
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>

					<div className="notification-wrapper">
						<button className="nav-action-btn" onClick={() => setShowNotifications(!showNotifications)}>
							<Bell size={20} />
							<span className="notification-badge">3</span>
						</button>
						{showNotifications && (
							<div className="nav-dropdown notification-dropdown card">
								<div className="dropdown-header">
									<h4>Notifications</h4>
									<button className="text-link">Mark all as read</button>
								</div>
								<div className="dropdown-body">
									<div className="dropdown-item unread">
										<AlertTriangle size={16} className="text-warning" />
										<div className="item-content">
											<p><strong>Low Stock Alert:</strong> iPhone 13 Pro is below 5 units.</p>
											<span>2 mins ago</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="user-profile-nav" onClick={onProfileClick}>
						<div className="user-info">
							<span className="user-name">{username}</span>
							<span className="user-role">{role}</span>
						</div>
						<div className="avatar-circle">
							{username.charAt(0)}
						</div>
						<ChevronDown size={16} className="chevron" />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
