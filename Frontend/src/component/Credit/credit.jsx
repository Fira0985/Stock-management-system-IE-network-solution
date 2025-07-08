import React, { useEffect, useState } from 'react';
import {
  Search, CreditCard, DollarSign, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { FiDownload } from 'react-icons/fi';
import {
  getAllCredits,
  getPaidCredits,
  getUnpaidCredits,
  getPartialCredits,
  makePayment
} from '../../services/creditService';
import PaymentModal from './PaymentModal';
import './credit.css';

const Credit = ({ isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({
    All: [],
    Paid: [],
    Unpaid: [],
    'Partially Paid': []
  });
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [all, paid, unpaid, partial] = await Promise.all([
        getAllCredits(),
        getPaidCredits(),
        getUnpaidCredits(),
        getPartialCredits()
      ]);

      const format = (sales) =>
        sales.map((sale) => ({
          id: sale.id,
          saleId: `#${sale.id}`,
          customer: sale.customer?.name || 'N/A',
          phone: sale.customer?.phone || 'N/A',
          credit_limit: sale.customer?.credit_limit || null,
          amount: sale.total || 0,
          discount: sale.discount_amount || 0,
          status: sale.payment_status,
          paid: sale.paid_amount || 0,
          balance_due: sale.balance_due || 0,
          createdAt: new Date(sale.created_at).toLocaleDateString(),
          itemsCount: sale.items?.length || 0
        }));

      setData({
        All: format(all),
        Paid: format(paid),
        Unpaid: format(unpaid),
        'Partially Paid': format(partial)
      });
    } catch (err) {
      console.error("Error loading credit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const tabs = [
    { id: 'All', label: 'All Credit', icon: CreditCard },
    { id: 'Paid', label: 'Paid', icon: CheckCircle },
    { id: 'Unpaid', label: 'Unpaid', icon: AlertCircle },
    { id: 'Partially Paid', label: 'Partially Paid', icon: Clock }
  ];

  const filteredData = data[activeTab]?.filter(item =>
    item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.saleId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="status-icon status-paid" />;
      case 'UNPAID': return <AlertCircle className="status-icon status-unpaid" />;
      case 'PARTIAL': return <Clock className="status-icon status-partial" />;
      default: return null;
    }
  };

  const handlePayment = (sale) => {
    setSelectedSale(sale);
    setModalOpen(true);
  };

  const handleSubmitPayment = async (saleId, amount) => {
    try {
      await makePayment({ sale_id: saleId, amount });
      setModalOpen(false);
      setSelectedSale(null);
      fetchAll();
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className={isSidebarOpen ? "credit-container" : "credit-container collapse"}>
      <div className="credit-header">
        <h1 className="credit-title">Credit Sales</h1>
        <button className="dashboard-btn secondary credit">
          <FiDownload className="btn-icon" />
          Export
        </button>
      </div>

      <div className="credit-content">
        <div className="credit-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by sale ID or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tab-container">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'tab-actives' : ''}`}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">{data[tab.id]?.length || 0}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-message">Loading credit sales...</div>
          ) : (
            <>
              <table className="credit-table">
                <thead>
                  <tr className="table-header">
                    <th>Sale ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Discount</th>
                    <th>Paid</th>
                    <th>Balance Due</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="table-row">
                      <td>{item.saleId}</td>
                      <td>{item.customer}</td>
                      <td>{item.phone}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>${item.discount.toFixed(2)}</td>
                      <td>${item.paid.toFixed(2)}</td>
                      <td>${item.balance_due.toFixed(2)}</td>
                      <td>{item.createdAt}</td>
                      <td>
                        <button
                          className="pay-button"
                          disabled={item.balance_due <= 0}
                          onClick={() => handlePayment(item)}
                        >
                          <DollarSign className="pay-icon" />
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="empty-state">
                  <CreditCard className="empty-icon" />
                  <h3>No records found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {modalOpen && selectedSale && (
        <PaymentModal
          sale={selectedSale}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitPayment}
        />
      )}
    </div>
  );
};

export default Credit;
