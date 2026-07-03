import React, { useState } from "react";
import "./sidebar.css";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ShoppingBag,
    CreditCard,
    BarChart2,
    Truck,
    Users,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    PhoneCall,
    ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, onToggle, onMenuSelect }) => {
    const [activeItem, setActiveItem] = useState("Dashboard");
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    const handleMenuClick = (label) => {
        setActiveItem(label);
        onMenuSelect(label);
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { icon: <Package size={20} />, label: "Inventory", children: ["Products", "Stock Taking", "Adjustments"] },
        { icon: <ShoppingCart size={20} />, label: "Sales" },
        { icon: <ShoppingBag size={20} />, label: "Purchase" },
        { icon: <CreditCard size={20} />, label: "Credits" },
        { icon: <BarChart2 size={20} />, label: "Reports" },
        { icon: <Truck size={20} />, label: "Suppliers" },
        { icon: <Users size={20} />, label: "Customers" },
        { icon: <User size={20} />, label: "Users" },
        { icon: <Settings size={20} />, label: "Settings" },
    ];

    const filteredItems = menuItems.filter((item) => {
        if (role === "CLERK") {
            const restricted = ["Users", "Suppliers", "Reports", "Purchase"];
            return !restricted.includes(item.label);
        }
        return true;
    });

    return (
        <aside className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
            <div className="sidebar-header">
                <div className="brand">
                    <BarChart2 className="brand-icon" size={24} />
                    {isSidebarOpen && <span>Track<span className="logo-accent">EQA</span></span>}
                </div>
                <button className="toggle-btn" onClick={() => onToggle(!isSidebarOpen)}>
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="menu-list">
                    {filteredItems.map((item) => (
                        <li key={item.label} className="menu-item-wrapper">
                            <div
                                className={`menu-item ${activeItem === item.label ? "active" : ""}`}
                                onClick={() => handleMenuClick(item.label)}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                {isSidebarOpen && <span className="menu-label">{item.label}</span>}
                            </div>
                            {/* Optional Category Tree for Inventory */}
                            {item.label === "Inventory" && isSidebarOpen && categoriesOpen && (
                                <ul className="sub-menu">
                                    <li onClick={() => handleMenuClick("Products")}>All Products</li>
                                    <li onClick={() => handleMenuClick("Categories")}>Categories</li>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="footer-item" onClick={() => handleMenuClick("Contact")}>
                    <PhoneCall size={20} />
                    {isSidebarOpen && <span>Support</span>}
                </div>
                <div className="footer-item logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    {isSidebarOpen && <span>Log Out</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
