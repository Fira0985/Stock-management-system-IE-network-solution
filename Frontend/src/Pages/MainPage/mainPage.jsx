import React from 'react';
import Sidebar from '../../component/Sidebar/sidebar';
import Dashboard from '../../component/Dashboard/dashboardPage';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default MainPage;
