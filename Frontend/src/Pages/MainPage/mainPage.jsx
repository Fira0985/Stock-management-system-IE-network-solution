import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar/sidebar';
// import Dashboard from '../../component/Dashboard/dashboardPage';
import './MainPage.css';
import Navbar from '../../component/Navbar/navbar';
import Product from '../../component/Product/product';

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Lifted state

  // This function will be passed as a callback to Sidebar
  const handleSidebarToggle = (openState) => {
    setIsSidebarOpen(openState);
  };

  return (
    
    <div  className={isSidebarOpen? "dashboard-container": "dashboard-container-collapsed"}>
      <Navbar isSidebarOpen={isSidebarOpen} />
      <Sidebar onToggle={handleSidebarToggle} />
      {/* <Dashboard isSidebarOpen={isSidebarOpen} /> */}
      <Product isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MainPage;
