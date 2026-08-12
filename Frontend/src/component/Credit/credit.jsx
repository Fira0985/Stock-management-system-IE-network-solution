import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Search,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import {
  getAllCredits,
  getPaidCredits,
  getUnpaidCredits,
  getPartialCredits,
  makePayment
} from '../../services/creditService';
import { exportSales } from '../../services/exportService';
import PaymentModal from './PaymentModal';
import './credit.css';

const ITEMS_PER_PAGE = 4;

const TABS = [
  { id: 'All', label: 'All Credit', icon: CreditCard },
  { id: 'Paid', label: 'Paid', icon: CheckCircle },
  { id: 'Unpaid', label: 'Unpaid', icon: AlertCircle },
  { id: 'Partially Paid', label: 'Partially Paid', icon: Clock }
];

// Single source of truth for status -> label/icon/style, used by getStatusMeta().
const STATUS_META = {
  PAID: { label: 'Paid', icon: CheckCircle, className: 'status-paid' },
  UNPAID: { label: 'Unpaid', icon: AlertCircle, className: 'status-unpaid' },
  PARTIAL: { label: 'Partial', icon: Clock, className: 'status-partial' }
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const formatCreditSale = (sale) => ({
  id: sale.id,
  saleId: `#${sale.id}`,
  customer: sale.customer?.name || 'N/A',
  phone: sale.customer?.phone || 'N/A',
  itemsCount: sale.items?.length || 0,
  amount: sale.total || 0,
  discount: sale.discount_amount || 0,
  status: sale.payment_status,
  paid: sale.paid_amount || 0,
  balanceDue: sale.balance_due || 0,
  createdAt: new Date(sale.created_at).toLocaleDateString()
});

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status];
  if (!meta) return <span className="status-badge">{status || 'N/A'}</span>;

  const Icon = meta.icon;
  return (
    <span className={`status-badge ${meta.className}`}>
      <Icon className="status-icon" />
      {meta.label}
    </span>
  );
};

const Credit = ({ isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({ All: [], Paid: [], Unpaid: [], 'Partially Paid': [] });
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [all, paid, unpaid, partial] = await Promise.all([
        getAllCredits(),
        getPaidCredits(),
        getUnpaidCredits(),
        getPartialCredits()
      ]);

      setData({
        All: all.map(formatCreditSale),
        Paid: paid.map(formatCreditSale),
        Unpaid: unpaid.map(formatCreditSale),
        'Partially Paid': partial.map(formatCreditSale)
      });
    } catch (err) {
      console.error('Error loading credit data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when tab or search changes
  }, [activeTab, searchTerm]);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const rows = data[activeTab] || [];
    if (!term) return rows;
    return rows.filter(
      (item) =>
        item.customer.toLowerCase().includes(term) || item.saleId.toLowerCase().includes(term)
    );
  }, [data, activeTab, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handlePayment = (sale) => {
    setSelectedSale(sale);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSale(null);
  };

  const handleSubmitPayment = async (saleId, amount) => {
    try {
      await makePayment({ sale_id: saleId, amount });
      closeModal();
      fetchAll();
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className={`credit-container ${isSidebarOpen ? '' : 'collapse'}`}>
      <div className="credit-header">
        <h1 className="credit-title">Credit Sales</h1>
        <button className="dashboard-btn secondary credit" onClick={() => exportSales(data.All)}>
          <Download className="btn-icon" />
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

          <div className="tab-container" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">{data[tab.id]?.length || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-message">Loading credit sales...</div>
          ) : filteredData.length === 0 ? (
            <div className="empty-state">
              <CreditCard className="empty-icon" />
              <h3>No records found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <table className="credit-table">
                <thead>
                  <tr className="table-header">
                    <th>Sale ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Discount</th>
                    <th>Paid</th>
                    <th>Balance Due</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="table-row">
                      <td className="sale-id" data-label="Sale ID">{item.saleId}</td>
                      <td className="customer-name" data-label="Customer">{item.customer}</td>
                      <td className="phone-number" data-label="Phone">{item.phone}</td>
                      <td data-label="Items">{item.itemsCount}</td>
                      <td className="amount" data-label="Total">{formatCurrency(item.amount)}</td>
                      <td className="amount" data-label="Discount">{formatCurrency(item.discount)}</td>
                      <td className="amount" data-label="Paid">{formatCurrency(item.paid)}</td>
                      <td className="amount balance-due" data-label="Balance Due">{formatCurrency(item.balanceDue)}</td>
                      <td data-label="Status">
                        <StatusBadge status={item.status} />
                      </td>
                      <td data-label="Date">{item.createdAt}</td>
                      <td data-label="Action">
                        <button
                          type="button"
                          className="pay-button"
                          disabled={item.balanceDue <= 0}
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

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      type="button"
                      key={i + 1}
                      className={currentPage === i + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && selectedSale && (
        <PaymentModal sale={selectedSale} onClose={closeModal} onSubmit={handleSubmitPayment} />
      )}
    </div>
  );
};

export default Credit;