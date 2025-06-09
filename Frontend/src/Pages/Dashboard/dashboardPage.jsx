import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
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

      <main className="main-content">
        <header className="topbar">
          <div className="title">Dashboard</div>
          <div className="topbar-right">
            <span className="icon">🔔</span>
            <span className="icon">🌞</span>
            <div className="avatar small" />
            <span>Samuel</span>
          </div>
        </header>

        <section className="overview">
          {["Total Stock Value", "Daily Sales", "Weekly Sales", "Monthly Sales"].map((label, i) => (
            <div className="card" key={i}>
              <p>{label}</p>
              <h3 className="amount">
                {label === "Daily Sales" ? "$200" :
                 label === "Monthly Sales" ? "$6,000" : "$1,500"}
              </h3>
            </div>
          ))}
        </section>

        <section className="statistics">
          <h2>Statistics</h2>
          <div className="charts">
            <div className="chart">
              <p>Weekly Sales</p>
              <div className="bars blue">
                {[...Array(6)].map((_, i) => (
                  <div className="bar" key={i}></div>
                ))}
              </div>
            </div>
            <div className="chart">
              <p>Monthly Sales</p>
              <div className="bars gray">
                {[...Array(6)].map((_, i) => (
                  <div className="bar" key={i}></div>
                ))}
              </div>
            </div>
            <div className="chart">
              <p>Annual Sales</p>
              <div className="bars blue">
                {[...Array(6)].map((_, i) => (
                  <div className="bar" key={i}></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li><span>Item returned</span><span>2h ago</span></li>
            <li><span>Empty stock</span><span>4h ago</span></li>
            <li><span>New sale</span><span>6h ago</span></li>
            <li><span>Item returned</span><span>7h ago</span></li>
            <li><span>Item returned</span><span>9h ago</span></li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
