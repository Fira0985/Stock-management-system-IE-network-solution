import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";

import { getUserNotifications } from "../../services/notificationService";

import {
    Bell,
    Menu,
    ChevronDown,
    AlertTriangle,
    ShoppingCart,
    CreditCard,
    Package,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({
    isSidebarOpen,
    onProfileClick,
    onHamburgerClick,
    lowStockCount = 0,
}) => {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const [userInfo, setUserInfo] = useState(() => {
        try {
            const stored = localStorage.getItem("userInfo");
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            return {};
        }
    });

    const notificationRef = useRef(null);

    /*
     * User information
     */
    const username =
        user?.username ||
        user?.name ||
        user?.userName ||
        userInfo.username ||
        userInfo.name ||
        userInfo.userName ||
        localStorage.getItem("userName") ||
        localStorage.getItem("username") ||
        "User";

    const role =
        user?.role ||
        userInfo.role ||
        localStorage.getItem("role") ||
        "Staff";

    const imagePath =
        user?.image_url ||
        user?.imageUrl ||
        user?.avatar ||
        userInfo.image_url ||
        userInfo.imageUrl ||
        userInfo.avatar ||
        null;

    /*
     * Fetch notifications from backend
     */
    const fetchNotifications = async () => {
        try {
            const email = localStorage.getItem("email");

            if (!email) {
                setNotifications([]);
                return;
            }

            const response = await getUserNotifications(email);

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setNotifications(data);
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );

            setNotifications([]);
        }
    };

    /*
     * Refresh user information
     */
    const refreshUserInfo = () => {
        try {
            const stored = localStorage.getItem("userInfo");

            setUserInfo(
                stored ? JSON.parse(stored) : {}
            );
        } catch (error) {
            setUserInfo({});
        }
    };

    /*
     * Initial loading
     */
    useEffect(() => {
        fetchNotifications();
        refreshUserInfo();

        window.addEventListener(
            "profileClosed",
            refreshUserInfo
        );

        return () => {
            window.removeEventListener(
                "profileClosed",
                refreshUserInfo
            );
        };
    }, []);

    /*
     * Refresh notifications every 30 seconds
     */
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    /*
     * Close notification dropdown
     * when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /*
     * Read notification IDs from localStorage
     *
     * IDs are stored per user so that one user's
     * read notifications do not affect another user
     */
    const getReadNotificationIds = () => {
        try {
            const email = localStorage.getItem("email");

            if (!email) return [];

            const storageKey =
                `readNotificationIds_${email}`;

            const stored =
                localStorage.getItem(storageKey);

            return stored
                ? JSON.parse(stored)
                : [];
        } catch (error) {
            return [];
        }
    };

    /*
     * Save read notification IDs
     */
    const saveReadNotificationIds = (ids) => {
        const email = localStorage.getItem("email");

        if (!email) return;

        const storageKey =
            `readNotificationIds_${email}`;

        localStorage.setItem(
            storageKey,
            JSON.stringify(ids)
        );
    };

    /*
     * Check whether notification is unread
     */
    const isNotificationUnread = (notification) => {
        const readIds =
            getReadNotificationIds();

        return !readIds.includes(
            notification.notificationId
        );
    };

    /*
     * Number of unread notifications
     */
    const unreadCount =
        notifications.filter(
            (notification) =>
                isNotificationUnread(
                    notification
                )
        ).length;

    /*
     * Mark all notifications as read
     */
    const markAllAsRead = () => {
        const currentReadIds =
            getReadNotificationIds();

        const notificationIds =
            notifications.map(
                (notification) =>
                    notification.notificationId
            );

        const newReadIds = [
            ...new Set([
                ...currentReadIds,
                ...notificationIds,
            ]),
        ];

        saveReadNotificationIds(
            newReadIds
        );

        /*
         * Force re-render
         */
        setNotifications([
            ...notifications,
        ]);
    };

    /*
     * Mark individual notification as read
     */
    const markAsRead = (notificationId) => {
        const currentReadIds =
            getReadNotificationIds();

        if (
            !currentReadIds.includes(
                notificationId
            )
        ) {
            saveReadNotificationIds([
                ...currentReadIds,
                notificationId,
            ]);

            setNotifications([
                ...notifications,
            ]);
        }
    };

    /*
     * API base URL for profile image
     */
    const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL?.replace(
            /\/api\/?$/,
            ""
        ) ||
        api.defaults.baseURL?.replace(
            /\/api\/?$/,
            ""
        ) ||
        "";

    const avatarSrc = imagePath
        ? imagePath.startsWith("http")
            ? imagePath
            : `${apiBaseUrl}/${imagePath.replace(
                  /^\//,
                  ""
              )}`
        : null;

    /*
     * Notification icon
     */
    const getNotificationIcon = (type) => {
        switch (type) {
            case "Sale":
                return (
                    <ShoppingCart
                        size={17}
                        className="notification-icon sale-icon"
                    />
                );

            case "Purchase":
                return (
                    <Package
                        size={17}
                        className="notification-icon purchase-icon"
                    />
                );

            case "Payment":
                return (
                    <CreditCard
                        size={17}
                        className="notification-icon payment-icon"
                    />
                );

            default:
                return (
                    <AlertTriangle
                        size={17}
                        className="notification-icon"
                    />
                );
        }
    };

    return (
        <nav
            className={`navbar ${
                isSidebarOpen
                    ? ""
                    : "expanded"
            }`}
        >
            {/* Left side */}
            <div className="navbar-left">
                <button
                    className="mobile-menu-btn"
                    onClick={onHamburgerClick}
                >
                    <Menu size={24} />
                </button>

                <span className="navbar-title">
                    Your Inventory
                </span>
            </div>

            {/* Right side */}
            <div className="navbar-right">

                {/* Quick Stats */}
                <div className="nav-quick-stats">
                    <div className="nav-stat-item warning">
                        <AlertTriangle
                            size={16}
                            className="stat-icon"
                        />

                        <span>
                            Low:{" "}
                            <strong className="text-warning">
                                {lowStockCount}
                            </strong>
                        </span>
                    </div>
                </div>

                <div className="nav-actions">

                    {/* Notifications */}
                    <div
                        className="notification-wrapper"
                        ref={notificationRef}
                    >
                        <button
                            className="nav-action-btn"
                            onClick={() =>
                                setShowNotifications(
                                    (previous) =>
                                        !previous
                                )
                            }
                            aria-label="Notifications"
                        >
                            <Bell size={20} />

                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="nav-dropdown notification-dropdown card">

                                {/* Header */}
                                <div className="dropdown-header">

                                    <div className="notification-header-title">
                                        <h4>
                                            Notifications
                                        </h4>

                                        {notifications.length >
                                            0 && (
                                            <span className="notification-total">
                                                {
                                                    notifications.length
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {unreadCount > 0 && (
                                        <button
                                            className="text-link"
                                            onClick={
                                                markAllAsRead
                                            }
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                {/* Notification list */}
                                <div className="dropdown-body">

                                    {notifications.length ===
                                    0 ? (
                                        <div className="notification-empty">
                                            <Bell
                                                size={30}
                                            />

                                            <p>
                                                No notifications
                                            </p>

                                            <span>
                                                New activity
                                                will appear
                                                here.
                                            </span>
                                        </div>
                                    ) : (
                                        notifications.map(
                                            (
                                                notification
                                            ) => {
                                                const unread =
                                                    isNotificationUnread(
                                                        notification
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            notification.notificationId
                                                        }
                                                        className={`dropdown-item ${
                                                            unread
                                                                ? "unread"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.notificationId
                                                            )
                                                        }
                                                    >
                                                        <div className="notification-icon-wrapper">
                                                            {getNotificationIcon(
                                                                notification.type
                                                            )}
                                                        </div>

                                                        <div className="item-content">
                                                            <p>
                                                                <strong>
                                                                    {
                                                                        notification.type
                                                                    }
                                                                </strong>{" "}
                                                                {
                                                                    notification.description
                                                                }
                                                            </p>

                                                            <span>
                                                                {new Date(
                                                                    notification.at
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {unread && (
                                                            <span className="notification-unread-dot" />
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )
                                    )}

                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div
                        className="user-profile-nav"
                        onClick={
                            onProfileClick
                        }
                    >
                        <div className="user-info">
                            <span className="user-name">
                                {username}
                            </span>

                            <span className="user-role">
                                {role}
                            </span>
                        </div>

                        <div className="avatar-circle">
                            {avatarSrc ? (
                                <img
                                    src={avatarSrc}
                                    alt={username}
                                    className="avatar-image"
                                />
                            ) : (
                                username
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <ChevronDown
                            size={16}
                            className="chevron"
                        />
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;