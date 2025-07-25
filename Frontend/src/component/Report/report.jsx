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
import { FiDownload } from "react-icons/fi";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, WidthType } from "docx";

const Report = ({ isSidebarOpen }) => {
  const [activeSection, setActiveSection] = useState('inventory');
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
    { id: 'inventory', label: 'Inventory Reports' },
    { id: 'sales', label: 'Sales Reports' },
    { id: 'purchase', label: 'Purchase Reports'},
    { id: 'payment', label: 'Payment & Credit'},
    { id: 'user', label: 'User Activity & Audit'},
    { id: 'business', label: 'Business Health'}
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
            </div>
          </div>
        );

      case 'business':
        return (
          <div className={isSidebarOpen ? "reports-section" : "reports-section collapse"}>
            <div className="report-grid">
              
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

  // Helper: Convert array of objects to docx Table
  function arrayToTable(arr, title) {
    if (!arr || arr.length === 0) return [];
    const keys = Object.keys(arr[0]);
    return [
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: keys.map(k => new TableCell({ children: [new Paragraph({ text: k, bold: true })] }))
          }),
          ...arr.map(row =>
            new TableRow({
              children: keys.map(k =>
                new TableCell({ children: [new Paragraph(String(row[k] ?? ""))] })
              )
            })
          )
        ]
      }),
      new Paragraph({ text: "" })
    ];
  }

  // Export as Word handler
  const handleExportWord = async () => {
    const data = reportData[activeSection];
    if (!data) return;

    let docChildren = [new Paragraph({ text: `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Report`, heading: HeadingLevel.HEADING_1 })];

    if (activeSection === "sales") {
      docChildren.push(
        new Paragraph({ text: "Sales Summary", heading: HeadingLevel.HEADING_2 }),
        new Paragraph(`Total Sales Amount: $${data.totalSalesAmount}`),
        new Paragraph(`Number of Sales: ${data.numberOfSales}`),
        new Paragraph(`Avg Sale Per Transaction: $${data.avgSalePerTransaction}`)
      );
      docChildren.push(...arrayToTable(data.topSellingProductsByQuantity, "Top Products by Quantity"));
      docChildren.push(...arrayToTable(data.topSellingProductsByRevenue, "Top Products by Revenue"));
      docChildren.push(...arrayToTable(data.salesByCategory, "Sales by Category"));
      docChildren.push(...arrayToTable(data.customersWithPendingDues, "Credit Sales Outstanding"));
      docChildren.push(...arrayToTable(data.salesPerformanceByUser, "Sales Performance by User"));
    } else if (activeSection === "inventory") {
      docChildren.push(...arrayToTable(data.stockMovementReport, "Stock Movement Report"));
      docChildren.push(
        new Paragraph({ text: "Inventory Value Report", heading: HeadingLevel.HEADING_2 }),
        new Paragraph(`Total Cost Value: $${data.totalCostValue}`),
        new Paragraph(`Total Sale Value: $${data.totalSaleValue}`),
        new Paragraph(`Estimated Profit: $${data.totalSaleValue - data.totalCostValue}`)
      );
      docChildren.push(...arrayToTable(data.profitMarginByProduct, "Profit Margin by Product"));
      docChildren.push(...arrayToTable(data.deadStockReport, "Dead Stock Report"));
    } else if (activeSection === "purchase") {
      docChildren.push(...arrayToTable(data.totalPurchasesBySupplier, "Total Purchases by Supplier"));
      docChildren.push(...arrayToTable(data.monthlyPurchaseTrend, "Monthly Purchase Trend"));
    } else if (activeSection === "payment") {
      if (data.paymentsByDay)
        docChildren.push(...arrayToTable(
          Object.entries(data.paymentsByDay).map(([date, amount]) => ({ date, amount })),
          "Payments by Day"
        ));
      if (data.paymentsByWeek)
        docChildren.push(...arrayToTable(
          Object.entries(data.paymentsByWeek).map(([week, amount]) => ({ week, amount })),
          "Payments by Week"
        ));
      if (data.paymentsByMonth)
        docChildren.push(...arrayToTable(
          Object.entries(data.paymentsByMonth).map(([month, amount]) => ({ month, amount })),
          "Payments by Month"
        ));
      docChildren.push(...arrayToTable(data.customerCreditReport, "Customer Credit Report"));
    } else if (activeSection === "user") {
      docChildren.push(...arrayToTable(data.usersCreatedDeleted, "Users Created/Deleted"));
      docChildren.push(...arrayToTable(data.productsAddedRemoved, "Products Added/Removed"));
      docChildren.push(...arrayToTable(data.categoriesAddedRemoved, "Categories Added/Removed"));
      docChildren.push(...arrayToTable(data.roleDistribution, "Role Distribution"));
    } else if (activeSection === "business") {
      if (data.grossProfitByDay)
        docChildren.push(...arrayToTable(
          Object.entries(data.grossProfitByDay).map(([date, profit]) => ({ date, profit })),
          "Gross Profit by Day"
        ));
      if (data.grossProfitByWeek)
        docChildren.push(...arrayToTable(
          Object.entries(data.grossProfitByWeek).map(([week, profit]) => ({ week, profit })),
          "Gross Profit by Week"
        ));
      if (data.grossProfitByMonth)
        docChildren.push(...arrayToTable(
          Object.entries(data.grossProfitByMonth).map(([month, profit]) => ({ month, profit })),
          "Gross Profit by Month"
        ));
      docChildren.push(
        new Paragraph({ text: "Revenue Forecast (Next Month)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph(`$${data.revenueForecastNextMonth}`)
      );
      docChildren.push(...arrayToTable(data.customerPurchaseFrequency, "Customer Purchase Frequency"));
      docChildren.push(...arrayToTable(data.supplierDependence, "Supplier Dependence"));
    }

    const doc = new Document({ sections: [{ children: docChildren }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${activeSection}_report.docx`);
  };

  return (
    <div className={isSidebarOpen ? "reports-container" : "reports-container collapse"}>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <h1>All Report</h1>
          <button className="report-export-btn" onClick={handleExportWord}>
            <FiDownload style={{ marginRight: 4 }} />
            Export as Word
          </button>
        </div>
      </div>

      <div className="tab-navigation">
        <div className="tab-container">
          {navItems.map(item => (
            <a
              key={item.id}
              className={`tab-item ${activeSection === item.id ? 'tab-active' : ''}`}
              onClick={() => switchToSection(item.id)}
            >
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
