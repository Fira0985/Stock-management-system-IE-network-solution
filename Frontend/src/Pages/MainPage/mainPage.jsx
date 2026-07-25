import React, { useState, useEffect } from "react";
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
import { fetchAllProducts } from "../../services/productService";

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const handleSelectMenu = (event) => {
      setSelectedPage(event.detail.menu);
    };
    window.addEventListener("selectMenu", handleSelectMenu);
    return () => window.removeEventListener("selectMenu", handleSelectMenu);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await fetchAllProducts();
        const lowStock = products.filter((product) => Number(product.unit || 0) < 10);
        setLowStockCount(lowStock.length);
      } catch (err) {
        console.error("Failed to fetch products for low stock count:", err);
      }
    };
    fetchProducts();
  }, []);


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
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onProfileClick={handleProfileClick}
        onHamburgerClick={() => setShowMobileSidebar(true)}
        lowStockCount={lowStockCount}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
        onMenuSelect={handleMenuSelect}
        isMobileVisible={showMobileSidebar}
        onCloseMobileSidebar={() => setShowMobileSidebar(false)}
      />

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
