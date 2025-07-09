import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './report.css';
import {
  fetchSalesSummary,
  fetchInventorySummary,
  fetchPurchaseSummary,
  fetchPaymentSummary,
  fetchUserActivitySummary,
  fetchBusinessHealthSummary
} from '../../services/reportService';

const Report = ({ isSidebarOpen }) => {
  const [activeSection, setActiveSection] = useState('sales');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize reportData with null for lazy loading per section
  const [reportData, setReportData] = useState({
    sales: null,
    inventory: null,
    purchase: null,
    payment: null,
    user: null,
    business: null,
  });

  const navItems = [
    { id: 'sales', label: 'Sales Reports', icon: '📊' },
    { id: 'inventory', label: 'Inventory Reports', icon: '📦' },
    { id: 'purchase', label: 'Purchase Reports', icon: '🧾' },
    { id: 'payment', label: 'Payment & Credit', icon: '💵' },
    { id: 'user', label: 'User Activity & Audit', icon: '👤' },
    { id: 'business', label: 'Business Health', icon: '📈' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (reportData[activeSection]) return; // data already loaded

      setLoading(true);
      setError(null);

      try {
        let data;
        switch (activeSection) {
          case 'sales':
            data = await fetchSalesSummary();
            break;
          case 'inventory':
            data = await fetchInventorySummary();
            break;
          case 'purchase':
            data = await fetchPurchaseSummary();
            break;
          case 'payment':
            data = await fetchPaymentSummary();
            break;
          case 'user':
            data = await fetchUserActivitySummary();
            break;
          case 'business':
            data = await fetchBusinessHealthSummary();
            break;
          default:
            data = null;
        }

        setReportData(prev => ({
          ...prev,
          [activeSection]: data || {}
        }));
      } catch (err) {
        setError(err.message || 'Failed to fetch report data');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, reportData]);

  const switchToSection = (sectionId) => {
    setActiveSection(sectionId);
    setError(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading report data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => setReportData(prev => ({ ...prev, [activeSection]: null }))}
          >
            Retry
          </button>
        </div>
      );
    }

    const data = reportData[activeSection];
    if (!data) return null;

    switch (activeSection) {
      case 'sales':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card">
                <h3>Sales Summary</h3>
                <div className="metric-large">${data.totalSalesAmount?.toLocaleString() || '0'}</div>
                <div className="metric-details">
                  <span>{data.numberOfSales || 0} transactions</span>
                  <span>Avg: ${data.avgSalePerTransaction?.toFixed(2) || 0}</span>
                </div>
              </div>

              <div className="card">
                <h3>Top Products by Quantity</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.topSellingProductsByQuantity?.map((product, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{product.productName}</span>
                          <span className="item-detail">{product.quantitySold} units</span>
                        </div>
                        <div className="item-value">${product.revenue?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Top Products by Revenue</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.topSellingProductsByRevenue?.map((product, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{product.productName}</span>
                          <span className="item-detail">{product.quantitySold} units</span>
                        </div>
                        <div className="item-value">${product.revenue?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Sales by Category</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.salesByCategory?.map((category, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{category.categoryName}</span>
                        </div>
                        <div className="item-value">${category.totalSales?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Credit Sales Outstanding</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.customersWithPendingDues?.map((credit, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{credit.customerName}</span>
                          <span className="item-detail">Due: {formatDate(credit.dueDate)}</span>
                        </div>
                        <div className="item-value alert">${credit.balanceDue?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Sales Performance by User</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.salesPerformanceByUser?.map((user, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{user.username}</span>
                          <span className="item-detail">{user.salesCount} sales</span>
                        </div>
                        <div className="item-value">${user.salesTotal?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card">
                <h3>Stock Movement Report</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.stockMovementReport?.map((item, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-detail">Purchased: {item.purchasedQuantity} • Sold: {item.soldQuantity}</span>
                        </div>
                        <div className="item-value">
                          Remaining: {item.currentStock}
                          {item.lowStockAlert && <span className="item-warning"> ⚠️ Low</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Inventory Value Report</h3>
                <div className="metric-large">${data.totalSaleValue?.toLocaleString() || '0'}</div>
                <div className="metric-details"><span>Total Sale Value</span></div>
                <div className="list-items">
                  <div className="list-item">
                    <div className="item-info"><span className="item-name">Total Cost Price</span></div>
                    <div className="item-value">${data.totalCostValue?.toLocaleString() || '0'}</div>
                  </div>
                  <div className="list-item">
                    <div className="item-info"><span className="item-name">Estimated Profit</span></div>
                    <div className="item-value success">
                      ${(data.totalSaleValue - data.totalCostValue)?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Profit Margin by Product</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.profitMarginByProduct?.map((product, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{product.productName}</span>
                        </div>
                        <div className="item-value">{product.profitMargin}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Dead Stock Report</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.deadStockReport?.map((item, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{item.productName}</span>
                        </div>
                        <div className="item-value warning">Unsold</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );


      case 'purchase':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card">
                <h3>Total Purchases by Supplier</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.totalPurchasesBySupplier?.map((supplier, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{supplier.supplierName}</span>
                          <span className="item-detail">Supplier ID: {supplier.supplierId}</span>
                        </div>
                        <div className="item-value">${supplier.totalPurchase?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Monthly Purchase Trend</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.monthlyPurchaseTrend?.map((month, index) => (
                      <div key={index} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{month.month}</span>
                        </div>
                        <div className="item-value">${month.amount?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card">
                <h3>Payment Collection by Day</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.paymentsByDay &&
                      Object.entries(data.paymentsByDay).map(([date, amount], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{date}</span>
                          </div>
                          <div className="item-value">${amount?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Payment Collection by Week</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.paymentsByWeek &&
                      Object.entries(data.paymentsByWeek).map(([week, amount], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{week}</span>
                          </div>
                          <div className="item-value">${amount?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Payment Collection by Month</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.paymentsByMonth &&
                      Object.entries(data.paymentsByMonth).map(([month, amount], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{month}</span>
                          </div>
                          <div className="item-value">${amount?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Customer Credit Report</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.customerCreditReport?.map((customer, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{customer.customerName}</span>
                          <span className="item-detail">Limit: ${customer.creditLimit?.toLocaleString() || '0'}</span>
                          <span className="item-detail">Used: ${customer.creditUsed?.toLocaleString() || '0'}</span>
                          <span className="item-detail">Due: ${customer.balanceDue?.toLocaleString() || '0'}</span>
                          {customer.dueDates && customer.dueDates.length > 0 && (
                            <span className="item-detail">
                              Due Dates: {customer.dueDates.map((d, i) => (
                                <span key={i}>{new Date(d).toLocaleDateString()}{i < customer.dueDates.length - 1 ? ', ' : ''}</span>
                              ))}
                            </span>
                          )}
                        </div>
                        <div className="item-value">${customer.balanceDue?.toLocaleString() || '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card">
                <h3>Users Created/Deleted</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.usersCreatedDeleted?.map((user, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{user.username}</span>
                          <span className="item-detail">Created: {user.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                          <span className="item-detail">
                            {user.deleted_at ? `Deleted: ${formatDate(user.deleted_at)}` : 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Products Added/Removed</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.productsAddedRemoved?.map((product, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{product.name}</span>
                          <span className="item-detail">Created: {product.created_at ? formatDate(product.created_at) : 'N/A'}</span>
                          <span className="item-detail">
                            {product.deleted_at ? `Deleted: ${formatDate(product.deleted_at)}` : 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Categories Added/Removed</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.categoriesAddedRemoved?.map((cat, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{cat.name}</span>
                          <span className="item-detail">Created: {cat.created_at ? formatDate(cat.created_at) : 'N/A'}</span>
                          <span className="item-detail">
                            {cat.deleted_at ? `Deleted: ${formatDate(cat.deleted_at)}` : 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Role Distribution</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.roleDistribution?.map((role, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{role.role}</span>
                        </div>
                        <div className="item-value">{role._count?.User || 0}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              <div className="card ">
                <h3>Gross Profit by Day</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.grossProfitByDay &&
                      Object.entries(data.grossProfitByDay).map(([date, profit], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{date}</span>
                          </div>
                          <div className="item-value">${profit?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="card ">
                <h3>Gross Profit by Week</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.grossProfitByWeek &&
                      Object.entries(data.grossProfitByWeek).map(([week, profit], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{week}</span>
                          </div>
                          <div className="item-value">${profit?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Gross Profit by Month</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.grossProfitByMonth &&
                      Object.entries(data.grossProfitByMonth).map(([month, profit], idx) => (
                        <div key={idx} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{month}</span>
                          </div>
                          <div className="item-value">${profit?.toLocaleString() || '0'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Revenue Forecast (Next Month)</h3>
                <div className="metric-large">${data.revenueForecastNextMonth?.toLocaleString() || '0'}</div>
              </div>
              <div className="card">
                <h3>Customer Purchase Frequency</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.customerPurchaseFrequency?.map((customer, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{customer.customerName}</span>
                        </div>
                        <div className="item-value">{customer.purchaseCount} purchases</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card ">
                <h3>Supplier Dependence</h3>
                <div className="scrollable-card-content">
                  <div className="list-items">
                    {data.supplierDependence?.map((supplier, idx) => (
                      <div key={idx} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{supplier.supplierName}</span>
                        </div>
                        <div className="item-value">{supplier.percentage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={isSidebarOpen ? "reports-container" : "reports-container collapse"}>
      <div className="header">
        <h1>All Report</h1>
      </div>

      <div className="tab-navigation">
        <div className="tab-container">
          {navItems.map(item => (
            <a
              key={item.id}
              className={`tab-item ${activeSection === item.id ? 'tab-active' : ''}`}
              onClick={() => switchToSection(item.id)}
            >
              <span className="tab-icon">{item.icon}</span>
              <span className="tab-label">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default Report;
