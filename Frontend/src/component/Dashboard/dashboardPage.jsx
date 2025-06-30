import React from 'react';
import './Dashboard.css';
import Navbar from '../Navbar/navbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

// Sample data
const weeklyData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 500 },
  { name: 'Thu', sales: 200 },
  { name: 'Fri', sales: 350 },
  { name: 'Sat', sales: 600 },
];

const monthlyData = [
  { name: 'Electronics', value: 400 },
  { name: 'Groceries', value: 300 },
  { name: 'Clothing', value: 200 },
  { name: 'Accessories', value: 100 },
];

const annualData = [
  { month: 'Jan', value: 1200 },
  { month: 'Feb', value: 2100 },
  { month: 'Mar', value: 800 },
  { month: 'Apr', value: 1600 },
  { month: 'May', value: 1900 },
];

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = ({ isSidebarOpen }) => {
  // Define the sales overview cards
  const salesOverview = [
    { label: "Total Sales Value", amount: "$15,000" },
    { label: "Daily Sales", amount: "$200" },
    { label: "Weekly Sales", amount: "$1,500" },
    { label: "Monthly Sales", amount: "$6,000" },
  ];

  // Define the purchase overview cards
  const purchaseOverview = [
    { label: "Total Purchase Value", amount: "$10,000" },
    { label: "Daily Purchase", amount: "$180" },
    { label: "Weekly Purchase", amount: "$1,200" },
    { label: "Monthly Purchase", amount: "$5,000" },
  ];

  return (
    <main className={isSidebarOpen ? "main-content" : "main-content-collapsed"}>

      <section className="overview">
        {/* First row: Sales */}
        <div className="overview-scroll">
          <div className="overview-row">
            {["Total Stock Value", "Daily Sales", "Weekly Sales", "Monthly Sales"].map((label, i) => (
              <div className="card" key={`sale-${i}`}>
                <p>{label}</p>
                <h3 className="amount">
                  {label === "Daily Sales" ? "$200" :
                    label === "Monthly Sales" ? "$6,000" : "$1,500"}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Second row: Purchases */}
        <div className="overview-scroll">
          <div className="overview-row">
            {["Total Purchase Value", "Daily Purchase", "Weekly Purchase", "Monthly Purchase"].map((label, i) => (
              <div className="card" key={`purchase-${i}`}>
                <p>{label}</p>
                <h3 className="amount">
                  {label === "Daily Purchase" ? "$180" :
                    label === "Monthly Purchase" ? "$5,400" : "$1,200"}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Updated Statistics with Recharts */}
      <section className="statistics">
        <h2>Statistics</h2>
        <div className="charts">

          {/* Weekly Sales: Bar Chart */}
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

          {/* Monthly Sales: Pie Chart */}
          <div className="chart">
            <p>Monthly Sales</p>
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

          {/* Annual Sales: Line Chart */}
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

      {/* Activity section stays the same */}
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
