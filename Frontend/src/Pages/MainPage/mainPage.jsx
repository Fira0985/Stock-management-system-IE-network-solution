import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar/sidebar';
import Dashboard from '../../component/Dashboard/dashboardPage';
import Navbar from '../../component/Navbar/navbar';
import Product from '../../component/Product/product';
import SupplierList from '../../component/Supplier/supplier';
import UserManagement from '../../component/User/userManagement';
import Customer from '../../component/Customer/customer';
import './MainPage.css';

const MainPage = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const handleSidebarToggle = (openState) => {
    setIsSidebarOpen(openState);
  };

  const handleMenuSelect = (menu) => {
    setSelectedPage(menu);
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard isSidebarOpen={isSidebarOpen} />;
      case "Products":
        return <Product isSidebarOpen={isSidebarOpen} />;
      case "Supplier":
        return <SupplierList isSidebarOpen={isSidebarOpen} />;
      case "User":
        return <UserManagement isSidebarOpen={isSidebarOpen} />;
      case "Customer":
        return <Customer isSidebarOpen={isSidebarOpen} />;
      default:
        return <Dashboard isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <div className={isSidebarOpen ? "dashboard-container" : "dashboard-container-collapsed"}>
      <Navbar isSidebarOpen={isSidebarOpen} />
      <Sidebar onToggle={handleSidebarToggle} onMenuSelect={handleMenuSelect} />
      {renderPage()}
    </div>
  );
};

export default MainPage;
