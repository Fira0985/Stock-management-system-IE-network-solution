import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './report.css';

const Report = ({ isSidebarOpen }) => {
  const [activeSection, setActiveSection] = useState('sales');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'sales', label: 'Sales Reports', icon: '📊' },
    { id: 'inventory', label: 'Inventory Reports', icon: '📦' },
    { id: 'purchase', label: 'Purchase Reports', icon: '🧾' },
    { id: 'payment', label: 'Payment & Credit', icon: '💵' },
    { id: 'user', label: 'User Activity & Audit', icon: '👤' },
    { id: 'business', label: 'Business Health', icon: '📈' }
  ];

  // Switch to section (tab functionality)
  const switchToSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock data for all reports
  const salesData = {
    daily: { total: 15420, transactions: 87, avgPerTransaction: 177 },
    weekly: { total: 94250, transactions: 534, avgPerTransaction: 176 },
    monthly: { total: 387500, transactions: 2156, avgPerTransaction: 180 }
  };

  const topProductsByQuantity = [
    { name: 'Premium Coffee Beans', quantity: 245, revenue: 12250 },
    { name: 'Organic Tea Set', quantity: 156, revenue: 9360 },
    { name: 'Laptop Stand', quantity: 134, revenue: 8040 },
    { name: 'Wireless Headphones', quantity: 89, revenue: 17800 },
    { name: 'Smart Watch', quantity: 67, revenue: 20100 }
  ];

  const topProductsByRevenue = [
    { name: 'Smart Watch', quantity: 67, revenue: 20100 },
    { name: 'Wireless Headphones', quantity: 89, revenue: 17800 },
    { name: 'Premium Coffee Beans', quantity: 245, revenue: 12250 },
    { name: 'Organic Tea Set', quantity: 156, revenue: 9360 },
    { name: 'Laptop Stand', quantity: 134, revenue: 8040 }
  ];

  const categoryData = [
    { category: 'Electronics', total: 125500 },
    { category: 'Beverages', total: 45200 },
    { category: 'Accessories', total: 32100 },
    { category: 'Books', total: 18900 },
    { category: 'Home & Garden', total: 28400 }
  ];

  const discountData = {
    total: 8450,
    period: 'This Month',
    breakdown: [
      { type: 'Bulk Discount', amount: 3200 },
      { type: 'Seasonal Sale', amount: 2800 },
      { type: 'Member Discount', amount: 1650 },
      { type: 'Clearance', amount: 800 }
    ]
  };

  const creditSales = [
    { customer: 'John Smith', balance: 1250, dueDate: '2024-01-15', creditLimit: 5000 },
    { customer: 'Sarah Johnson', balance: 890, dueDate: '2024-01-20', creditLimit: 3000 },
    { customer: 'Mike Davis', balance: 2100, dueDate: '2024-01-25', creditLimit: 8000 },
    { customer: 'Emily Wilson', balance: 750, dueDate: '2024-01-30', creditLimit: 2500 }
  ];

  const userPerformance = [
    { user: 'Alex Manager', role: 'OWNER', salesCount: 125, salesAmount: 28500 },
    { user: 'Lisa Clerk', role: 'CLERK', salesCount: 89, salesAmount: 19800 },
    { user: 'Tom Assistant', role: 'CLERK', salesCount: 76, salesAmount: 16200 },
    { user: 'Sarah Auditor', role: 'AUDITOR', salesCount: 0, salesAmount: 0 }
  ];

  const stockMovement = [
    { product: 'Premium Coffee Beans', purchased: 500, sold: 245, remaining: 255 },
    { product: 'Wireless Headphones', purchased: 150, sold: 89, remaining: 61 },
    { product: 'Organic Tea Set', purchased: 300, sold: 156, remaining: 144 },
    { product: 'Smart Watch', purchased: 100, sold: 67, remaining: 33 },
    { product: 'Laptop Stand', purchased: 200, sold: 134, remaining: 66 }
  ];

  const lowStockItems = [
    { product: 'Coffee Filters', current: 12, threshold: 50 },
    { product: 'USB Cables', current: 8, threshold: 25 },
    { product: 'Notebook A4', current: 15, threshold: 40 },
    { product: 'Printer Ink', current: 3, threshold: 20 }
  ];

  const inventoryValue = {
    totalCostPrice: 145000,
    totalSalePrice: 298000,
    profitMargin: 153000
  };

  const profitMargins = [
    { product: 'Smart Watch', costPrice: 200, salePrice: 300, margin: 100, marginPercent: 50 },
    { product: 'Wireless Headphones', costPrice: 150, salePrice: 200, margin: 50, marginPercent: 33 },
    { product: 'Premium Coffee Beans', costPrice: 30, salePrice: 50, margin: 20, marginPercent: 67 },
    { product: 'Organic Tea Set', costPrice: 40, salePrice: 60, margin: 20, marginPercent: 50 },
    { product: 'Laptop Stand', costPrice: 45, salePrice: 60, margin: 15, marginPercent: 33 }
  ];

  const deadStock = [
    { product: 'Old Phone Cases', lastSold: '2023-08-15', quantity: 45, value: 2250 },
    { product: 'Vintage Keyboards', lastSold: '2023-07-20', quantity: 23, value: 1380 },
    { product: 'DVD Collection', lastSold: '2023-06-10', quantity: 67, value: 1005 },
    { product: 'Flip Phones', lastSold: '2023-05-03', quantity: 12, value: 840 }
  ];

  const supplierPurchases = [
    { supplier: 'TechCorp Solutions', totalPurchases: 45600, products: 23 },
    { supplier: 'Global Electronics', totalPurchases: 38200, products: 19 },
    { supplier: 'Premium Goods Ltd', totalPurchases: 29800, products: 15 },
    { supplier: 'Office Supplies Inc', totalPurchases: 22500, products: 31 }
  ];

  const monthlyPurchases = [
    { month: 'January', amount: 34500 },
    { month: 'February', amount: 28900 },
    { month: 'March', amount: 31200 },
    { month: 'April', amount: 29800 },
    { month: 'May', amount: 33100 }
  ];

  const paymentCollections = [
    { period: 'Daily', amount: 12500 },
    { period: 'Weekly', amount: 78400 },
    { period: 'Monthly', amount: 312000 }
  ];

  const customerCredit = [
    { customer: 'John Smith', creditLimit: 5000, creditUsed: 1250, balance: 1250 },
    { customer: 'Sarah Johnson', creditLimit: 3000, creditUsed: 890, balance: 890 },
    { customer: 'Mike Davis', creditLimit: 8000, creditUsed: 2100, balance: 2100 },
    { customer: 'Emily Wilson', creditLimit: 2500, creditUsed: 750, balance: 750 }
  ];

  const userActivity = [
    { action: 'User Created', item: 'Tom Assistant', by: 'Alex Manager', timestamp: '2024-01-15 10:30' },
    { action: 'Product Added', item: 'Smart Watch Pro', by: 'Lisa Clerk', timestamp: '2024-01-14 14:20' },
    { action: 'Category Added', item: 'Wearables', by: 'Alex Manager', timestamp: '2024-01-13 09:15' },
    { action: 'Sale Deleted', item: 'Sale #1234', by: 'Sarah Auditor', timestamp: '2024-01-12 16:45' }
  ];

  const roleDistribution = [
    { role: 'OWNER', count: 1 },
    { role: 'CLERK', count: 2 },
    { role: 'AUDITOR', count: 1 }
  ];

  const profitabilityReport = [
    { period: 'Daily', revenue: 15420, cost: 9250, profit: 6170 },
    { period: 'Weekly', revenue: 94250, cost: 56550, profit: 37700 },
    { period: 'Monthly', revenue: 387500, cost: 232500, profit: 155000 }
  ];

  const customerFrequency = [
    { customer: 'John Smith', purchases: 12, lastPurchase: '2024-01-10' },
    { customer: 'Sarah Johnson', purchases: 8, lastPurchase: '2024-01-12' },
    { customer: 'Mike Davis', purchases: 15, lastPurchase: '2024-01-11' },
    { customer: 'Emily Wilson', purchases: 6, lastPurchase: '2024-01-09' }
  ];

  const supplierDependence = [
    { supplier: 'TechCorp Solutions', dependence: 65, criticalProducts: 8 },
    { supplier: 'Global Electronics', dependence: 45, criticalProducts: 5 },
    { supplier: 'Premium Goods Ltd', dependence: 30, criticalProducts: 3 },
    { supplier: 'Office Supplies Inc', dependence: 25, criticalProducts: 2 }
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'sales':
        return (
          <div className="report-section">

            <div className="report-grid">
              <div className="card summary">
                <h3>Daily Sales Summary</h3>
                <div className="metric-large">${salesData.daily.total.toLocaleString()}</div>
                <div className="metric-details">
                  <span>{salesData.daily.transactions} transactions</span>
                  <span>Avg: ${salesData.daily.avgPerTransaction}</span>
                </div>
              </div>

              <div className="card summary">
                <h3>Weekly Sales Summary</h3>
                <div className="metric-large">${salesData.weekly.total.toLocaleString()}</div>
                <div className="metric-details">
                  <span>{salesData.weekly.transactions} transactions</span>
                  <span>Avg: ${salesData.weekly.avgPerTransaction}</span>
                </div>
              </div>

              <div className="card summary">
                <h3>Monthly Sales Summary</h3>
                <div className="metric-large">${salesData.monthly.total.toLocaleString()}</div>
                <div className="metric-details">
                  <span>{salesData.monthly.transactions} transactions</span>
                  <span>Avg: ${salesData.monthly.avgPerTransaction}</span>
                </div>
              </div>

              <div className="card">
                <h3>Top Products by Quantity</h3>
                <div className="list-items">
                  {topProductsByQuantity.map((product, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{product.name}</span>
                        <span className="item-detail">{product.quantity} units</span>
                      </div>
                      <div className="item-value">${product.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Top Products by Revenue</h3>
                <div className="list-items">
                  {topProductsByRevenue.map((product, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{product.name}</span>
                        <span className="item-detail">{product.quantity} units</span>
                      </div>
                      <div className="item-value">${product.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Sales by Category</h3>
                <div className="list-items">
                  {categoryData.map((category, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{category.category}</span>
                      </div>
                      <div className="item-value">${category.total.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Discount Usage Report</h3>
                <div className="metric-large">${discountData.total.toLocaleString()}</div>
                <div className="metric-details">
                  <span>{discountData.period}</span>
                </div>
                <div className="list-items">
                  {discountData.breakdown.map((discount, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{discount.type}</span>
                      </div>
                      <div className="item-value">${discount.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Credit Sales Outstanding</h3>
                <div className="list-items">
                  {creditSales.map((credit, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{credit.customer}</span>
                        <span className="item-detail">Due: {credit.dueDate}</span>
                        <span className="item-detail">Limit: ${credit.creditLimit.toLocaleString()}</span>
                      </div>
                      <div className="item-value alert">${credit.balance.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Sales Performance by User</h3>
                <div className="list-items">
                  {userPerformance.map((user, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{user.user}</span>
                        <span className="item-detail">{user.role} • {user.salesCount} sales</span>
                      </div>
                      <div className="item-value">${user.salesAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="report-section">

            <div className="report-grid">
              <div className="card">
                <h3>Stock Movement Report</h3>
                <div className="list-items">
                  {stockMovement.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{item.product}</span>
                        <span className="item-detail">Purchased: {item.purchased} • Sold: {item.sold}</span>
                      </div>
                      <div className="item-value">Remaining: {item.remaining}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Low Stock Alerts</h3>
                <div className="list-items">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{item.product}</span>
                        <span className="item-detail">Threshold: {item.threshold}</span>
                      </div>
                      <div className="item-value warning">Current: {item.current}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Inventory Value Report</h3>
                <div className="metric-large">${inventoryValue.totalSalePrice.toLocaleString()}</div>
                <div className="metric-details">
                  <span>Total Sale Value</span>
                </div>
                <div className="list-items">
                  <div className="list-item">
                    <div className="item-info">
                      <span className="item-name">Total Cost Price</span>
                    </div>
                    <div className="item-value">${inventoryValue.totalCostPrice.toLocaleString()}</div>
                  </div>
                  <div className="list-item">
                    <div className="item-info">
                      <span className="item-name">Potential Profit</span>
                    </div>
                    <div className="item-value success">${inventoryValue.profitMargin.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Profit Margin by Product</h3>
                <div className="list-items">
                  {profitMargins.map((product, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{product.product}</span>
                        <span className="item-detail">Cost: ${product.costPrice} • Sale: ${product.salePrice}</span>
                      </div>
                      <div className="item-value">
                        ${product.margin} ({product.marginPercent}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Dead Stock Report</h3>
                <div className="list-items">
                  {deadStock.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{item.product}</span>
                        <span className="item-detail">Last sold: {item.lastSold}</span>
                        <span className="item-detail">Quantity: {item.quantity}</span>
                      </div>
                      <div className="item-value warning">${item.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'purchase':
        return (
          <div className="report-section">

            <div className="report-grid">
              <div className="card">
                <h3>Total Purchases by Supplier</h3>
                <div className="list-items">
                  {supplierPurchases.map((supplier, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{supplier.supplier}</span>
                        <span className="item-detail">{supplier.products} products</span>
                      </div>
                      <div className="item-value">${supplier.totalPurchases.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Monthly Purchase Trend</h3>
                <div className="list-items">
                  {monthlyPurchases.map((month, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{month.month} 2024</span>
                      </div>
                      <div className="item-value">${month.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="report-section">

            <div className="report-grid">
              <div className="card">
                <h3>Payment Collection Report</h3>
                <div className="list-items">
                  {paymentCollections.map((payment, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{payment.period}</span>
                      </div>
                      <div className="item-value">${payment.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Customer Credit Report</h3>
                <div className="list-items">
                  {customerCredit.map((customer, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{customer.customer}</span>
                        <span className="item-detail">Limit: ${customer.creditLimit.toLocaleString()}</span>
                        <span className="item-detail">Used: ${customer.creditUsed.toLocaleString()}</span>
                      </div>
                      <div className="item-value">${customer.balance.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div className="report-section">
            <div className="report-grid">
              <div className="card">
                <h3>Recent User Activity</h3>
                <div className="list-items">
                  {userActivity.map((activity, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{activity.action}</span>
                        <span className="item-detail">{activity.item}</span>
                        <span className="item-detail">By: {activity.by} • {activity.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Role Distribution</h3>
                <div className="list-items">
                  {roleDistribution.map((role, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{role.role}</span>
                      </div>
                      <div className="item-value">{role.count} users</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="report-section">

            <div className="report-grid">
              <div className="card">
                <h3>Profitability Report</h3>
                <div className="list-items">
                  {profitabilityReport.map((period, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{period.period}</span>
                        <span className="item-detail">Revenue: ${period.revenue.toLocaleString()}</span>
                        <span className="item-detail">Cost: ${period.cost.toLocaleString()}</span>
                      </div>
                      <div className="item-value success">${period.profit.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Customer Purchase Frequency</h3>
                <div className="list-items">
                  {customerFrequency.map((customer, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{customer.customer}</span>
                        <span className="item-detail">Last: {customer.lastPurchase}</span>
                      </div>
                      <div className="item-value">{customer.purchases} purchases</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Supplier Dependence Analysis</h3>
                <div className="list-items">
                  {supplierDependence.map((supplier, index) => (
                    <div key={index} className="list-item">
                      <div className="item-info">
                        <span className="item-name">{supplier.supplier}</span>
                        <span className="item-detail">Critical products: {supplier.criticalProducts}</span>
                      </div>
                      <div className="item-value">{supplier.dependence}% dependence</div>
                    </div>
                  ))}
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
      {/* Header */}
      <div className="header">
        <h1>All Report</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-container">
          {navItems.map((item) => (
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

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default Report;