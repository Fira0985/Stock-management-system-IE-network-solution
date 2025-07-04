import React, { useState } from "react";
import Sidebar from "../../component/Sidebar/sidebar";
import Dashboard from "../../component/Dashboard/dashboardPage";
import Navbar from "../../component/Navbar/navbar";
import Product from "../../component/Product/product";
import SupplierList from "../../component/Supplier/supplier";
import UserManagement from "../../component/User/userManagement";
import Customer from "../../component/Customer/customer";
import UserProfile from "../../component/userManagement/userProfile";
import "./MainPage.css";
import PurchaseTable from "../../component/purchase/purchase";
import Sales from "../../component/Sale/sale";
import Report from "../../component/Report/report";
import Settings from "../../component/Settings/settings";

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleSidebarToggle = (openState) => {
    setIsSidebarOpen(openState);
  };

  const handleMenuSelect = (menu) => {
    setSelectedPage(menu);
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
  };

  const closeProfilePopup = () => {
    setShowUserProfile(false);
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard isSidebarOpen={isSidebarOpen} />;
      case "Products":
        return <Product isSidebarOpen={isSidebarOpen} />;

      case "Sales":
        return <Sales isSidebarOpen={isSidebarOpen} />;
      case "Purchase":
        return <PurchaseTable isSidebarOpen={isSidebarOpen} />;
      case "Supplier":
        return <SupplierList isSidebarOpen={isSidebarOpen} />;
      case "User":
        return <UserManagement isSidebarOpen={isSidebarOpen} />;
      case "Customer":
        return <Customer isSidebarOpen={isSidebarOpen} />;
      case "Report":
        return <Report isSidebarOpen={isSidebarOpen} />;
      case "Settings":
        return <Settings isSidebarOpen={isSidebarOpen} />;

      default:
        return <Dashboard isSidebarOpen={isSidebarOpen} />;
    }
  };

  function handleDataFromChild(data) {
    setShowUserProfile(data);
  }

  return (
    <div
      className={
        isSidebarOpen ? "dashboard-container" : "dashboard-container-collapsed"
      }
    >
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onProfileClick={handleProfileClick}
      />
      <Sidebar onToggle={handleSidebarToggle} onMenuSelect={handleMenuSelect} />
      {renderPage()}

      {showUserProfile && (
        <div className="modal-overlay" onClick={closeProfilePopup}>
          <div className="modal-contents" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProfilePopup}>
              &times;
            </button>
            <UserProfile onSendToParent={handleDataFromChild} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
