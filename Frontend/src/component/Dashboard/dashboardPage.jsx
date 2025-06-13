import React from 'react';
import './Dashboard.css';
import Navbar from '../Navbar/navbar';

const Dashboard = () => {
  return (
    <main className="main-content">
      <Navbar />

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
  );
};

export default Dashboard;
