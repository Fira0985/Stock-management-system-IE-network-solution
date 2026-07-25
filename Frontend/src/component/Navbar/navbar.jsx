import React, { useState, useEffect, useRef } from "react";
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
	const dropdownRef = useRef(null);

	useEffect(() => {
		// Fetch user notifications (backend expects email query param)
		const fetchNotifications = async () => {
			try {
				const email = localStorage.getItem('email');
				if (!email) return;
				const res = await api.get('/api/notifications/user', { params: { email } });
				const data = res.data || [];
				// mark all as unread initially
				setNotifications(data.map(n => ({ ...n, unread: true })));
			} catch (err) {
				console.error('Failed to fetch notifications', err);
			}
		};
		fetchNotifications();
	}, []);

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
				{/* Search removed per request */}
			</div>

			<div className="navbar-right">
				{/* Quick Stats Bar */}
				<div className="nav-quick-stats">
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
								{notifications.filter(n => n.unread).length > 0 && (
									<span className="notification-badge">{notifications.filter(n => n.unread).length}</span>
								)}
							</button>
						{showNotifications && (
							<div ref={dropdownRef} className="nav-dropdown notification-dropdown card" onMouseLeave={() => setShowNotifications(false)}>
								<div className="dropdown-header">
									<h4>Notifications</h4>
									<button className="text-link" onClick={() => {
										setNotifications(notifications.map(n => ({ ...n, unread: false })));
										// Optionally: send mark-read to backend when endpoint exists
									}}>Mark all as read</button>
								</div>
								<div className="dropdown-body">
									{notifications.length === 0 ? (
										<div className="dropdown-item empty">No notifications</div>
									) : (
										notifications.map((n, idx) => (
											<div key={idx} className={`dropdown-item ${n.unread ? 'unread' : ''}`}>
												<AlertTriangle size={16} className="text-warning" />
												<div className="item-content">
													<p><strong>{n.type}</strong> {n.description}</p>
													<span>{new Date(n.at).toLocaleString()}</span>
												</div>
											</div>
										))
									)}
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
