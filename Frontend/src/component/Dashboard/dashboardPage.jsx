import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  Package,
  AlertTriangle,
  Truck,
  TrendingUp,
  Plus,
  Download,
  Search,
  ChevronRight,
  Filter,
  MoreVertical,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  fetchSalesOverview,
  fetchPurchaseOverview,
  fetchRecentActivity
} from "../../services/statisticsApi";
import { fetchAllProducts } from "../../services/productService";

const Dashboard = ({ isSidebarOpen }) => {
  const [salesOverview, setSalesOverview] = useState({ totalSales: 0, dailySales: 0 });
  const [purchaseOverview, setPurchaseOverview] = useState({ totalPurchases: 0 });
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sales, purchase, prodList, recent] = await Promise.all([
          fetchSalesOverview(),
          fetchPurchaseOverview(),
          fetchAllProducts(),
          fetchRecentActivity()
        ]);
        setSalesOverview(sales);
        setPurchaseOverview(purchase);
        setProducts(prodList);
        setActivity(recent);
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const lowStockItems = products.filter(p => p.unit < 10);

  return (
    <main className={`main-content ${isSidebarOpen ? "" : "expanded"}`}>
      {/* 1. Header Section: Quick Stats */}
      <header className="dashboard-header">
        <div className="header-titles">
          <h1>Business Overview</h1>
          <p>Precise data for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Download size={16} /> Export Reports</button>
          <button className="btn btn-primary"><Plus size={16} /> New Inventory</button>
        </div>
      </header>

      <section className="quick-stats-bar">
        <div className="stat-card card">
          <div className="stat-icon-bg info"><Package size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total SKUs</span>
            <div className="stat-value">{products.length}</div>
            <div className="stat-trend neutral">No change</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon-bg danger"><AlertTriangle size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Low Stock</span>
            <div className="stat-value text-danger">{lowStockItems.length}</div>
            <div className="stat-trend down"><ArrowDownRight size={14} /> Critical</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon-bg success"><TrendingUp size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Today's Sales</span>
            <div className="stat-value">${salesOverview.dailySales.toLocaleString()}</div>
            <div className="stat-trend up"><ArrowUpRight size={14} /> +12.5%</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon-bg warning"><Truck size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Incoming Orders</span>
            <div className="stat-value">5</div>
            <div className="stat-trend neutral">Pending</div>
          </div>
        </div>
      </section>

      {/* 2. Central Layout */}
      <div className="dashboard-layout">
        {/* Left Panel: Categories */}
        <aside className="layout-panel left-panel card">
          <div className="panel-header">
            <h3>Categories</h3>
            <Search size={16} className="text-muted" />
          </div>
          <ul className="category-tree">
            <li className="category-item active">
              <ChevronRight size={16} />
              <span>All Inventory</span>
              <span className="count">{products.length}</span>
            </li>
            <li className="category-item">
              <ChevronRight size={16} />
              <span>Electronics</span>
              <span className="count">42</span>
            </li>
            <li className="category-item">
              <ChevronRight size={16} />
              <span>Office Supplies</span>
              <span className="count">128</span>
            </li>
          </ul>
        </aside>

        {/* Center: Main Data Table */}
        <section className="layout-panel center-panel">
          <div className="table-card card">
            <div className="table-header">
              <h3>Recent Stock Movements</h3>
              <div className="table-actions">
                <button className="icon-btn"><Filter size={18} /></button>
                <button className="icon-btn"><MoreVertical size={18} /></button>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map(product => (
                    <tr key={product.id}>
                      <td><strong>{product.name}</strong></td>
                      <td className="mono">{product.sku || 'SKU-00' + product.id}</td>
                      <td>{product.category?.name || 'General'}</td>
                      <td>{product.unit}</td>
                      <td>
                        <span className={`status-dot ${product.unit < 10 ? 'status-critical' : 'status-valid'}`}></span>
                        {product.unit < 10 ? 'Low Stock' : 'In Stock'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <button className="text-link">View all movements <Activity size={14} /></button>
            </div>
          </div>
        </section>

        {/* Right Panel: Alerts & Quick Actions */}
        <aside className="layout-panel right-panel">
          <div className="alert-panel card">
            <div className="panel-header">
              <h3>Alerts</h3>
              <span className="alert-count">{lowStockItems.length}</span>
            </div>
            <div className="alert-list">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} className="alert-item critical">
                    <div className="alert-info">
                      <p><strong>{item.name}</strong> is critically low ({item.unit} units left).</p>
                      <button className="btn btn-primary btn-sm">Create PO</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-alerts">All stock levels are optimal.</div>
              )}
            </div>
          </div>

          <div className="quick-action-panel card">
            <h3>Quick Actions</h3>
            <div className="action-grid">
              <button className="action-btn">
                <div className="icon warning"><Download size={18} rotate={180} /></div>
                <span>Receive Stock</span>
              </button>
              <button className="action-btn">
                <div className="icon info"><Package size={18} /></div>
                <span>Stock Adjust</span>
              </button>
              <button className="action-btn">
                <div className="icon success"><Plus size={18} /></div>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Dashboard;
