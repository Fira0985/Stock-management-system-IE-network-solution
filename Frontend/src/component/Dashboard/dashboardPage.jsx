// src/components/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { FiUpload, FiDownload } from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

import {
  fetchSalesOverview,
  fetchPurchaseOverview,
  fetchWeeklySalesChart,
  fetchMonthlyCategoryChart,
  fetchAnnualSalesChart,
  fetchRecentActivity,
} from "../../services/statisticsApi";

const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = ({ isSidebarOpen }) => {
  const [salesOverview, setSalesOverview] = useState({
    totalSales: 0,
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
  });

  const [purchaseOverview, setPurchaseOverview] = useState({
    totalPurchases: 0,
    dailyPurchases: 0,
    weeklyPurchases: 0,
    monthlyPurchases: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [annualData, setAnnualData] = useState([]);
  const [activity, setActivity] = useState([]);

  const [activeTab, setActiveTab] = useState("charts");

  const scrollRef = React.useRef(null);

  const scrollHorizontal = (direction) => {
    if (!scrollRef.current) return;
    const amount = 220;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    Promise.all([
      fetchSalesOverview(),
      fetchPurchaseOverview(),
      fetchWeeklySalesChart(),
      fetchMonthlyCategoryChart(),
      fetchAnnualSalesChart(),
      fetchRecentActivity(),
    ])
      .then(([salesOv, purchaseOv, weekly, monthlyCat, annual, recent]) => {
        setSalesOverview(salesOv);
        setPurchaseOverview(purchaseOv);
        setWeeklyData(weekly.map((d) => ({ name: d.day, sales: d.sales })));
        setMonthlyData(
          monthlyCat.map((d) => ({ name: d.category, value: d.value }))
        );
        setAnnualData(annual.map((d) => ({ month: d.month, value: d.value })));
        setActivity(recent);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
      });
  }, []);

  const cards = [
    {
      label: "Total Sales Value",
      amount: `$${salesOverview.totalSales.toLocaleString()}`,
    },
    {
      label: "Daily Sales",
      amount: `$${salesOverview.dailySales.toLocaleString()}`,
    },
    {
      label: "Weekly Sales",
      amount: `$${salesOverview.weeklySales.toLocaleString()}`,
    },
    {
      label: "Monthly Sales",
      amount: `$${salesOverview.monthlySales.toLocaleString()}`,
    },
    {
      label: "Total Purchase Value",
      amount: `$${purchaseOverview.totalPurchases.toLocaleString()}`,
    },
    {
      label: "Daily Purchase",
      amount: `$${purchaseOverview.dailyPurchases.toLocaleString()}`,
    },
    {
      label: "Weekly Purchase",
      amount: `$${purchaseOverview.weeklyPurchases.toLocaleString()}`,
    },
    {
      label: "Monthly Purchase",
      amount: `$${purchaseOverview.monthlyPurchases.toLocaleString()}`,
    },
  ];

  return (
    <main className={isSidebarOpen ? "main-content" : "main-content-collapsed"}>
      <div className="dashboard-actions">
        <h1 className="dashboard-titles">Overview</h1>
        <button className="dashboard-btn secondary">
          <FiDownload className="btn-icon" />
          Export
        </button>
      </div>
      <section className="overview-scroll-wrapper">
        <button
          className="scroll-arrow left"
          onClick={() => scrollHorizontal("left")}
        >
          &#8249;
        </button>
        <div className="overview-horizontal-scroll" ref={scrollRef}>
          {cards.map((card, i) => (
            <div className="cards" key={`card-${i}`}>
              <p>{card.label}</p>
              <h3 className="amount">{card.amount}</h3>
            </div>
          ))}
        </div>
        <button
          className="scroll-arrow right"
          onClick={() => scrollHorizontal("right")}
        >
          &#8250;
        </button>
      </section>

      <div className="dashboard-tab-container">
        <div className="tab-buttons">
          <button
            className={activeTab === "charts" ? "active" : ""}
            onClick={() => setActiveTab("charts")}
          >
            Charts
          </button>
          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            Recent Activity
          </button>
        </div>

        {activeTab === "charts" ? (
          <div className="dashboard-charts">
            <div className="chart">
              <p>Weekly Sales</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    fill="#001aff"
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart">
              <p>Monthly Sales by Category</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={monthlyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart">
              <p>Annual Sales</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={annualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#001aff"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="activity-section">
            <p>Recent Activity</p>
            <ul className="activity-list">
              {activity.length === 0 ? (
                <li>
                  <span>No recent activity</span>
                </li>
              ) : (
                activity.map((item, index) => (
                  <li key={index}>
                    <span>{item.description}</span>
                    <span>
                      {new Date(item.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
