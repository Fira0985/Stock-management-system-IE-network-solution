import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Building2,
  ShoppingCart
} from "lucide-react";
import {
  fetchSalesOverview,
  fetchPurchaseOverview,
  fetchRecentActivity,
  fetchUnpaidCreditValue,
  fetchSupplierCount,
  fetchCustomerCount
} from "../../services/statisticsApi";
import { fetchAllProducts } from "../../services/productService";

const Dashboard = ({ isSidebarOpen }) => {
  const [salesOverview, setSalesOverview] = useState({ totalSales: 0, dailySales: 0 });
  const [purchaseOverview, setPurchaseOverview] = useState({ totalPurchases: 0 });
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [unpaidCredit, setUnpaidCredit] = useState({ totalValue: 0, count: 0 });
  const [supplierCount, setSupplierCount] = useState({ count: 0 });
  const [customerCount, setCustomerCount] = useState({ count: 0 });
  const [loading, setLoading] = useState(true);

  const handleExport = () => {
    toast("Coming soon! Export feature is under development.", { type: "info" });
  };

  const handleImport = () => {
    toast("Coming soon! Import feature is under development.", { type: "info" });
  };

  const handleNavigateToProducts = () => {
    window.dispatchEvent(new CustomEvent("selectMenu", { detail: { menu: "Products" } }));
  };

  const handleNavigateToSales = () => {
    window.dispatchEvent(new CustomEvent("selectMenu", { detail: { menu: "Sales" } }));
  };

  const handleNavigateToPurchase = () => {
    window.dispatchEvent(new CustomEvent("selectMenu", { detail: { menu: "Purchase" } }));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sales, purchase, prodList, recent, unpaid, suppliers, customers] = await Promise.all([
          fetchSalesOverview(),
          fetchPurchaseOverview(),
          fetchAllProducts(),
          fetchRecentActivity(),
          fetchUnpaidCreditValue(),
          fetchSupplierCount(),
          fetchCustomerCount()
        ]);
        setSalesOverview(sales);
        setPurchaseOverview(purchase);
        setProducts(prodList);
        setActivity(recent);
        setUnpaidCredit(unpaid);
        setSupplierCount(suppliers);
        setCustomerCount(customers);
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const lowStockItems = products.filter((product) => Number(product.unit || 0) < 10);
  const categorySummary = products.reduce((acc, product) => {
    const name = product.category?.name || "General";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const recentProducts = products.slice(0, 6);

  const totalQuantity = products.reduce((sum, p) => sum + (Number(p.unit) || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((Number(p.sale_price) || 0) * (Number(p.unit) || 0)), 0);
  const lowStockCount = lowStockItems.length;
  const totalPurchasesValue = Number(purchaseOverview?.totalPurchases || 0);
  const totalSalesValue = Number(salesOverview?.totalSales || 0);

  return (
    <main className={`main-content ${isSidebarOpen ? "" : "expanded"}`}>
      <header className="dashboard-header">
        <div className="header-titles">
          <p className="eyebrow">Operations dashboard</p>
          <h1>Inventory at a glance</h1>
          <p>Updated for {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-primary" onClick={handleImport}>
            <Plus size={16} /> Import
          </button>
        </div>
      </header>

      <section className="quick-stats-bar">
        {/* Removed distinct SKU card as requested */}

        <div className="stat-card card">
          <div className="stat-icon-bg info"><Package size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Quantity</span>
            <div className="stat-value">{loading ? "—" : totalQuantity.toLocaleString()}</div>
            <div className="stat-trend neutral">Units in stock</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg success"><TrendingUp size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Value</span>
            <div className="stat-value">{loading ? "$0" : `$${totalValue.toLocaleString()}`}</div>
            <div className="stat-trend up"><ArrowUpRight size={14} /> Inventory value</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg danger"><AlertTriangle size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Low Stock</span>
            <div className="stat-value">{loading ? "—" : lowStockCount}</div>
            <div className="stat-trend down"><ArrowDownRight size={14} /> Needs attention</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg warning"><Truck size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Purchases</span>
            <div className="stat-value">{loading ? "$0" : `$${totalPurchasesValue.toLocaleString()}`}</div>
            <div className="stat-trend neutral">All-time purchase value</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg success"><TrendingUp size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Sales</span>
            <div className="stat-value">{loading ? "$0" : `$${totalSalesValue.toLocaleString()}`}</div>
            <div className="stat-trend neutral">All-time sales value</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg danger"><DollarSign size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Unpaid Credit</span>
            <div className="stat-value">{loading ? "$0" : `$${unpaidCredit.totalValue.toLocaleString()}`}</div>
            <div className="stat-trend neutral">{unpaidCredit.count} pending transactions</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg info"><Building2 size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Suppliers</span>
            <div className="stat-value">{loading ? "—" : supplierCount.count}</div>
            <div className="stat-trend neutral">Active suppliers</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-bg success"><Users size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Customers</span>
            <div className="stat-value">{loading ? "—" : customerCount.count}</div>
            <div className="stat-trend neutral">Active customers</div>
          </div>
        </div>
      </section>

      <div className="dashboard-layout">
        <aside className="layout-panel left-panel card">
          <div className="panel-header">
            <h3>Inventory by category</h3>
            {/* SKUs chip removed per request */}
          </div>
          <ul className="category-tree">
            {topCategories.length > 0 ? (
              topCategories.map(([name, count]) => (
                <li className={`category-item ${name === "General" ? "active" : ""}`} key={name}>
                  <ChevronRight size={16} />
                  <div className="category-meta">
                    <span>{name}</span>
                    <small>{count} items</small>
                  </div>
                  <span className="count">{count}</span>
                </li>
              ))
            ) : (
              <li className="empty-state">No inventory data yet.</li>
            )}
          </ul>
        </aside>

        <section className="layout-panel center-panel">
          <div className="table-card card">
            <div className="table-header">
              <div>
                <h3>Recent stock movement</h3>
                <p className="table-subtitle">Latest products and availability</p>
              </div>
              <div className="table-actions">
                <button className="icon-btn" aria-label="Filter"><Filter size={18} /></button>
                <button className="icon-btn" aria-label="More options"><MoreVertical size={18} /></button>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id}>
                      <td><strong>{product.name}</strong></td>
                      <td className="mono">{product.sku || `SKU-00${product.id}`}</td>
                      <td>{product.category?.name || "General"}</td>
                      <td>{product.unit}</td>
                      <td>
                        <span className={`status-dot ${Number(product.unit || 0) < 10 ? "status-critical" : "status-valid"}`}></span>
                        {Number(product.unit || 0) < 10 ? "Low Stock" : "In Stock"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="layout-panel right-panel">
          <div className="alert-panel card">
            <div className="panel-header">
              <h3>Low stock alerts</h3>
              <span className="alert-count">{lowStockItems.length}</span>
            </div>
            <div className="alert-list">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="alert-item critical">
                    <div className="alert-info">
                      <p><strong>{item.name}</strong> is running low ({item.unit} units left).</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-alerts">All stock levels are healthy.</div>
              )}
            </div>
          </div>

          <div className="quick-action-panel card">
            <h3>Quick actions</h3>
            <div className="action-grid">
              <button className="action-btn" onClick={handleNavigateToProducts}>
                <div className="icon info"><Package size={18} /></div>
                <span>Product</span>
              </button>
              <button className="action-btn" onClick={handleNavigateToSales}>
                <div className="icon success"><ShoppingCart size={18} /></div>
                <span>Sale</span>
              </button>
              <button className="action-btn" onClick={handleNavigateToPurchase}>
                <div className="icon warning"><Truck size={18} /></div>
                <span>Purchase</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Dashboard;
