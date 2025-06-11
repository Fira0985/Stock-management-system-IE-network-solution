import React from 'react';
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">Stock<span>.</span></div>
      <ul className="menu">
        <li>Dashboard</li>
        <li>Products</li>
        <li>Sales</li>
        <li>Purchase</li>
        <li>Credits</li>
        <li>Report</li>
        <li>Supplier</li>
        <li>Customer</li>
        <li>User</li>
        <li>Settings</li>
      </ul>
      <div className="user-profile">
        <div className="avatar" />
        <div>Samuel</div>
        <button className="logout-btn">Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
