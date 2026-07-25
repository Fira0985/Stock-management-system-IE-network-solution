import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import {
	Bell,
	User,
	Menu,
	Search,
	ChevronDown,
	Info,
	Package,
	AlertTriangle
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ isSidebarOpen, onProfileClick, onHamburgerClick, lowStockCount = 0 }) => {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const [userInfo, setUserInfo] = useState(() => {
		const stored = localStorage.getItem('userInfo');
		return stored ? JSON.parse(stored) : {};
	});
	const username = user?.username || user?.name || user?.userName || userInfo.username || userInfo.name || userInfo.userName || localStorage.getItem('userName') || localStorage.getItem('username') || 'User';
	const role = user?.role || userInfo.role || localStorage.getItem('role') || 'Staff';
	const imagePath = user?.image_url || user?.imageUrl || user?.avatar || userInfo.image_url || userInfo.imageUrl || userInfo.avatar || null;
	const dropdownRef = useRef(null);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const email = localStorage.getItem('email');
				if (!email) return;
				const res = await api.get('/api/notifications/user', { params: { email } });
				const data = res.data || [];
				setNotifications(data.map(n => ({ ...n, unread: true })));
			} catch (err) {
				console.error('Failed to fetch notifications', err);
			}
		};

		const refreshUserInfo = () => {
			const stored = localStorage.getItem('userInfo');
			setUserInfo(stored ? JSON.parse(stored) : {});
		};

		fetchNotifications();
		refreshUserInfo();
		window.addEventListener('profileClosed', refreshUserInfo);
		return () => {
			window.removeEventListener('profileClosed', refreshUserInfo);
		};
	}, []);

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || api.defaults.baseURL?.replace(/\/api\/?$/, '') || '';
	const avatarSrc = imagePath
		? (imagePath.startsWith('http') ? imagePath : `${apiBaseUrl}/${imagePath.replace(/^\//, '')}`)
		: null;

	return (
		<nav className={`navbar ${isSidebarOpen ? "" : "expanded"}`}>
			<div className="navbar-left">
				<button className="mobile-menu-btn" onClick={onHamburgerClick}>
					<Menu size={24} />
				</button>
				<span className="navbar-title">Your Inventory</span>
				{/* Search removed per request */}
			</div>

			<div className="navbar-right">
				{/* Quick Stats Bar */}
				<div className="nav-quick-stats">
					<div className="nav-stat-item warning">
						<AlertTriangle size={16} className="stat-icon" />
						<span>Low: <strong className="text-warning">{lowStockCount}</strong></span>
					</div>
				</div>

				<div className="nav-actions">
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
							{avatarSrc ? (<img src={avatarSrc} alt={username} className="avatar-image" />) : (username.charAt(0))}
						</div>
						<ChevronDown size={16} className="chevron" />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
