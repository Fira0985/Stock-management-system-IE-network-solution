import React, { useEffect, useState, useMemo } from 'react';
import './purchase.css';
import { fetchAllPurchases } from '../../services/purchaseService';
import { exportPurchases } from "../../services/exportService";
import PurchasePopup from './purchasePopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiDownload } from 'react-icons/fi';

const ITEMS_PER_PAGE = 5;

const PurchaseTable = ({ isSidebarOpen }) => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [filter, setFilter] = useState('today');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const loadPurchases = async () => {
        setLoading(true);
        try {
            const response = await fetchAllPurchases();
            setPurchases(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading purchases:', err);
            setError('Failed to load purchases.');
            setPurchases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPurchases();
    }, []);

    const getDateRange = (filter) => {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        switch (filter) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'yesterday':
                start.setDate(now.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(now.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                break;
            case 'last7days':
                start.setDate(now.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'thisMonth':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'lastMonth':
                start.setMonth(now.getMonth() - 1);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(now.getMonth() - 1);
                end.setDate(new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate());
                end.setHours(23, 59, 59, 999);
                break;
            default:
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    };

    const filteredPurchases = useMemo(() => {
        const { start, end } = getDateRange(filter);
        return purchases.filter(p => {
            const d = new Date(p.created_at);
            return d >= start && d <= end;
        });
    }, [purchases, filter]);

    const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);

    const paginatedPurchases = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPurchases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPurchases, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowClick = (purchase) => {
        setSelectedPurchase(purchase);
    };

    return (
        <div className={isSidebarOpen ? "purchase-container" : "purchase-container collapse"}>
            <div className="header-section">
                <h2 className="page-title">All Purchases</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="purchase-btn" onClick={() => setShowPopup(true)}>Purchase</button>
                    <button
                        className="purchase-export-btn"
                        onClick={() => exportPurchases(purchases)}
                    >
                        <FiDownload style={{ marginRight: 4 }} />
                        Export
                    </button>
                </div>
            </div>

            <div className="tabs">
                {['today', 'yesterday', 'last7days', 'thisMonth', 'lastMonth'].map(f => (
                    <span
                        key={f}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        onClick={() => { setFilter(f); setCurrentPage(1); }}
                    >
                        {f === 'today' ? 'Today' :
                            f === 'yesterday' ? 'Yesterday' :
                                f === 'last7days' ? 'Last 7 days' :
                                    f === 'thisMonth' ? 'This month' : 'Last month'}
                    </span>
                ))}
            </div>

            {loading ? (
                <p>Loading purchases...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : filteredPurchases.length === 0 ? (
                <p>No purchases found in this period.</p>
            ) : (
                <>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Purchase ID</th>
                                <th>Date</th>
                                <th>Supplier</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPurchases.map(item => {
                                const total = item.items.reduce((sum, i) => sum + (i.quantity * i.cost_price), 0);
                                const isBulk = item.items.length > 1;
                                return (
                                    <tr key={item.id} onClick={() => handleRowClick(item)}>
                                        <td>#{item.id}</td>
                                        <td className="date-link">{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>{item.supplier?.name || 'N/A'}</td>
                                        <td>${total.toFixed(2)}</td>
                                        <td>
                                            <span className={`type-label ${isBulk ? 'bulk' : 'single'}`}>
                                                {isBulk ? 'Bulk' : 'Single'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>

                    <div className="pagination">
                        <span
                            className={`nav-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => goToPage(currentPage - 1)}
                        >← Previous</span>

                        {[...Array(totalPages)].map((_, i) => (
                            <span
                                key={i}
                                className={currentPage === i + 1 ? 'active' : ''}
                                onClick={() => goToPage(i + 1)}
                            >{i + 1}</span>
                        ))}

                        <span
                            className={`nav-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => goToPage(currentPage + 1)}
                        >Next →</span>
                    </div>
                </>
            )}

            {showPopup && (
                <PurchasePopup
                    onClose={() => setShowPopup(false)}
                    onSuccess={loadPurchases}
                />
            )}

            {selectedPurchase && (
                <div className="popup-overlay" onClick={() => setSelectedPurchase(null)}>
                    <div className="popup-box" onClick={e => e.stopPropagation()}>
                        <div className="popup-header">
                            <h3>Purchase #{selectedPurchase.id} Details</h3>
                            <button onClick={() => setSelectedPurchase(null)}>×</button>
                        </div>
                        <div className="popup-body">
                            <p><strong>Supplier:</strong> {selectedPurchase.supplier?.name}</p>
                            <p><strong>Date:</strong> {new Date(selectedPurchase.created_at).toLocaleString()}</p>
                            <h4>Items:</h4>
                            <ul>
                                {selectedPurchase.items.map((item, index) => (
                                    <li key={index}>
                                        {item.product.name} – {item.quantity} × ${item.cost_price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default PurchaseTable;
