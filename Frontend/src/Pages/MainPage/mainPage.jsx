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
import Notificaton from "../../component/Notificaton/notification";
import Contact from "../../component/Contact/Contact";
import Credits from "../../component/Credit/credit";

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

  const handleDataFromChild = (shouldClose) => {
    setShowUserProfile(shouldClose);
    if (!shouldClose) {
      // Notify Navbar to refresh name/avatar after profile is closed
      window.dispatchEvent(new CustomEvent("profileClosed"));
    }
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
      case "Notificaton":
        return <Notificaton isSidebarOpen={isSidebarOpen} />;
      case "Contact":
        return <Contact isSidebarOpen={isSidebarOpen} />;
      case "Credits":
        return <Credits isSidebarOpen={isSidebarOpen} />;
      default:
        return <Dashboard isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <div
      className={
        isSidebarOpen ? "dashboard-container" : "dashboard-container-collapsed"
      }
    >
      <Navbar isSidebarOpen={isSidebarOpen} onProfileClick={handleProfileClick} />
      <Sidebar onToggle={handleSidebarToggle} onMenuSelect={handleMenuSelect} />
      {renderPage()}

      {showUserProfile && (
        <div className="modal-overlay">
          <UserProfile onSendToParent={handleDataFromChild} />
        </div>
      )}
    </div>
  );
};

export default MainPage;
