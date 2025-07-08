import React, { useState } from 'react';
import { Search, CreditCard, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './credit.css';

const Credit = ({ isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const creditData = [
    {
      saleId: '#1234',
      customer: 'Sarah',
      phone: '415-555-1234',
      location: 'San Francisco',
      amount: 25.00,
      productId: 'SKU:1234',
      status: 'Unpaid',
      remainingAmount: 25.00
    },
    {
      saleId: '#1235',
      customer: 'John',
      phone: '415-555-5678',
      location: 'New York',
      amount: 50.00,
      productId: 'SKU:5678',
      status: 'Partially Paid',
      remainingAmount: 25.00
    },
    {
      saleId: '#1236',
      customer: 'Alice',
      phone: '415-555-9101',
      location: 'Chicago',
      amount: 75.00,
      productId: 'SKU:9101',
      status: 'Unpaid',
      remainingAmount: 75.00
    },
    {
      saleId: '#1237',
      customer: 'Bob',
      phone: '415-555-1121',
      location: 'Los Angeles',
      amount: 100.00,
      productId: 'SKU:1121',
      status: 'Paid',
      remainingAmount: 0.00
    },
    {
      saleId: '#1238',
      customer: 'Emma',
      phone: '415-555-2233',
      location: 'Miami',
      amount: 150.00,
      productId: 'SKU:2233',
      status: 'Partially Paid',
      remainingAmount: 75.00
    },
    {
      saleId: '#1239',
      customer: 'David',
      phone: '415-555-3344',
      location: 'Seattle',
      amount: 200.00,
      productId: 'SKU:3344',
      status: 'Paid',
      remainingAmount: 0.00
    }
  ];

  const tabs = [
    { id: 'All', label: 'All Credit', icon: CreditCard },
    { id: 'Paid', label: 'Paid', icon: CheckCircle },
    { id: 'Unpaid', label: 'Unpaid', icon: AlertCircle },
    { id: 'Partially Paid', label: 'Partially Paid', icon: Clock }
  ];

  const filteredData = creditData.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="status-icon status-paid" />;
      case 'Unpaid':
        return <AlertCircle className="status-icon status-unpaid" />;
      case 'Partially Paid':
        return <Clock className="status-icon status-partial" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'status-badge status-paid';
      case 'Unpaid':
        return 'status-badge status-unpaid';
      case 'Partially Paid':
        return 'status-badge status-partial';
      default:
        return 'status-badge';
    }
  };

  const getTotalsByStatus = () => {
    return creditData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  };

  const totals = getTotalsByStatus();

  return (
    <div className={isSidebarOpen ? "credit-container" : "credit-container collapse"}>
      <div className="credit-header">
        <div className="header-content">
          <h1 className="credit-title">
            All Credit
          </h1>
        </div>
      </div>

      <div className="credit-content">
        <div className="credit-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by order, customer, or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tab-container">
            {tabs.map((tab) => {
              const count = tab.id === 'All' ? creditData.length : (totals[tab.id] || 0);
              return (
                <a
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'tab-actives' : ''}`}
                >
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-count">{count}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="table-container">
          <table className="credit-table">
            <thead>
              <tr className="table-header">
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Product ID</th>
                <th>Status</th>
                <th>Remaining Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="sale-id">{item.saleId}</td>
                  <td className="customer-name">{item.customer}</td>
                  <td className="phone-number">{item.phone}</td>
                  <td className="location">{item.location}</td>
                  <td className="amount">${item.amount.toFixed(2)}</td>
                  <td className="product-id">{item.productId}</td>
                  <td className="status-cell">
                    <div className={getStatusClass(item.status)}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </div>
                  </td>
                  <td className="remaining-amount">${item.remainingAmount.toFixed(2)}</td>
                  <td className="action-cell">
                    <button className="pay-button">
                      <DollarSign className="pay-icon" />
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <CreditCard className="empty-icon" />
            <h3>No records found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Credit;