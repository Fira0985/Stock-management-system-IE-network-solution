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
} from "lucide-react";
import { FiChevronLeft, FiChevronRight, FiPhoneCall, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard"); // <-- active item tracked
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const { isMobileVisible, onCloseMobileSidebar } = props;

  const sidebarClass = `sidebar ${isOpen ? "" : "collapsed"} ${isMobileVisible ? "mobile-visible" : ""
    }`;

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (props.onToggle) {
      props.onToggle(newState);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleMenuClick = (label) => {
    setActiveItem(label); // set active
    props.onMenuSelect(label);
  };

  const allMenuItems = [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { icon: <Package size={16} />, label: "Products" },
    { icon: <ShoppingCart size={16} />, label: "Sales" },
    { icon: <ShoppingBag size={16} />, label: "Purchase" },
    { icon: <CreditCard size={16} />, label: "Credits" },
    { icon: <BarChart2 size={16} />, label: "Report" },
    { icon: <Truck size={16} />, label: "Supplier" },
    { icon: <Users size={16} />, label: "Customer" },
    { icon: <User size={16} />, label: "User" },
    { icon: <Settings size={16} />, label: "Settings" },
  ];

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (role === "CLERK") {
      const restrictedLabels = ["User", "Supplier", "Report", "Purchase"];
      return !restrictedLabels.includes(item.label);
    }
    return true;
  });

  return (
    <>
      <aside className={sidebarClass}>
        <div className="sidebar-header">
          <div className="brand">
            {isOpen ? (
              <>
                Track<span>እቃ</span>
                <span>.</span>
              </>
            ) : (
              <>T.</>
            )}
          </div>
          <button className="toggle-btn" onClick={handleToggle}>
            {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <ul className="menu">
          {filteredMenuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleMenuClick(item.label)}
              className={activeItem === item.label ? "active" : ""}
            >
              {item.icon} {isOpen && item.label}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          {isOpen ? (
            <>
              <div className="user-profile">
                <ul className="sidebar-contact-list">
                  <li
                    className="contact-item"
                    onClick={() => handleMenuClick("Contact")}
                  >
                    <FiPhoneCall size={16} className="contact-icon" />
                    <span className="contact-label">Contact</span>
                  </li>
                </ul>
              </div>
              {/* <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button> */}
            </>
          ) : (
            <>
              <div className="user-profile-collapse">
                <ul className="sidebar-contact-list">
                  <li
                    className="contact-item"
                    onClick={() => handleMenuClick("Contact")}
                    title="Contact"
                  >
                    <FiPhoneCall size={20} className="contact-icon" />
                  </li>
                </ul>
              </div>
              {/* <button className="logout-btn-collopse" title="Logout" onClick={handleLogout}>
                <FiLogOut size={18} />
              </button> */}
            </>
          )}
        </div>

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
      </aside>

      {isMobileVisible && window.innerWidth < 768 && (
        <div className="overlay" onClick={onCloseMobileSidebar}></div>
      )}
    </>

  );
};

export default Sidebar;
