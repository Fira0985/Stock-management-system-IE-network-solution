// src/components/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Navbar from '../Navbar/navbar';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

import {
  fetchSalesOverview,
  fetchPurchaseOverview,
  fetchWeeklySalesChart,
  fetchMonthlyCategoryChart,
  fetchAnnualSalesChart,
  fetchRecentActivity
} from '../../services/statisticsApi';

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = ({ isSidebarOpen }) => {
  const [salesOverview, setSalesOverview] = useState({
    totalSales: 0,
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0
  });

  const [purchaseOverview, setPurchaseOverview] = useState({
    totalPurchases: 0,
    dailyPurchases: 0,
    weeklyPurchases: 0,
    monthlyPurchases: 0
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [annualData, setAnnualData] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchSalesOverview(),
      fetchPurchaseOverview(),
      fetchWeeklySalesChart(),
      fetchMonthlyCategoryChart(),
      fetchAnnualSalesChart(),
      fetchRecentActivity()
    ])
      .then(([salesOv, purchaseOv, weekly, monthlyCat, annual, recent]) => {
        setSalesOverview(salesOv);
        setPurchaseOverview(purchaseOv);
        setWeeklyData(weekly.map(d => ({ name: d.day, sales: d.sales })));
        setMonthlyData(monthlyCat.map(d => ({ name: d.category, value: d.value })));
        setAnnualData(annual.map(d => ({ month: d.month, value: d.value })));
        setActivity(recent);
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err);
      });
  }, []);

  const salesCards = [
    { label: 'Total Sales Value', amount: `$${salesOverview.totalSales.toLocaleString()}` },
    { label: 'Daily Sales', amount: `$${salesOverview.dailySales.toLocaleString()}` },
    { label: 'Weekly Sales', amount: `$${salesOverview.weeklySales.toLocaleString()}` },
    { label: 'Monthly Sales', amount: `$${salesOverview.monthlySales.toLocaleString()}` }
  ];

  const purchaseCards = [
    { label: 'Total Purchase Value', amount: `$${purchaseOverview.totalPurchases.toLocaleString()}` },
    { label: 'Daily Purchase', amount: `$${purchaseOverview.dailyPurchases.toLocaleString()}` },
    { label: 'Weekly Purchase', amount: `$${purchaseOverview.weeklyPurchases.toLocaleString()}` },
    { label: 'Monthly Purchase', amount: `$${purchaseOverview.monthlyPurchases.toLocaleString()}` }
  ];

  return (
    <>
      <main className={isSidebarOpen ? 'main-content' : 'main-content-collapsed'}>
        <section className="overview">
          {/* Sales Overview Cards */}
          <div className="overview-scroll">
            <div className="overview-row">
              {salesCards.map((card, i) => (
                <div className="card" key={`sale-${i}`}>
                  <p>{card.label}</p>
                  <h3 className="amount">{card.amount}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Overview Cards */}
          <div className="overview-scroll">
            <div className="overview-row">
              {purchaseCards.map((card, i) => (
                <div className="card" key={`purchase-${i}`}>
                  <p>{card.label}</p>
                  <h3 className="amount">{card.amount}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="statistics">
          <h2>Statistics</h2>
          <div className="charts">

            {/* Weekly Sales Bar Chart */}
            <div className="chart">
              <p>Weekly Sales</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#001aff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Sales by Category Pie Chart */}
            <div className="chart">
              <p>Monthly Sales by Category</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={monthlyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Annual Sales Line Chart */}
            <div className="chart">
              <p>Annual Sales</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={annualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#001aff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {activity.length === 0 ? (
              <li><span>No recent activity</span></li>
            ) : (
              activity.map((item, index) => (
                <li key={index}>
                  <span>{item.description}</span>
                  <span>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
