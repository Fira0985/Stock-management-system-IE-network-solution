import React, { useEffect, useState, useMemo } from 'react';
import './purchase.css';
import { fetchAllPurchases } from '../../services/purchaseService';
import PurchasePopup from './purchasePopup';

const ITEMS_PER_PAGE = 10;

const PurchaseTable = ({ isSidebarOpen }) => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    // New states for filtering and pagination
    const [filter, setFilter] = useState('today');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch purchases once on mount
    const loadPurchases = async () => {
        setLoading(true);
        try {
            const response = await fetchAllPurchases();
            setPurchases(response.data || response || []);
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

    // Utility function: get date range for filter
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
                start.setDate(now.getDate() - 6); // last 7 days including today
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
                end.setDate(new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()); // last day of last month
                end.setHours(23, 59, 59, 999);
                break;

            default:
                // Default to today if unknown
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    };

    // Filter purchases by selected date range
    const filteredPurchases = useMemo(() => {
        const { start, end } = getDateRange(filter);
        return purchases.filter(purchase => {
            const purchaseDate = new Date(purchase.created_at);
            return purchaseDate >= start && purchaseDate <= end;
        });
    }, [purchases, filter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);

    const paginatedPurchases = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPurchases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPurchases, currentPage]);

    // Handle filter tab click
    const handleFilterClick = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); // reset to first page when filter changes
    };

    // Handle page navigation
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={isSidebarOpen ? "purchase-container" : "purchase-container collapse"}>
            <div className="header-section">
                <h2 className="page-title">All Purchases</h2>
                <button className="purchase-btn" onClick={() => setShowPopup(true)}>Purchase</button>
            </div>

            <div className="tabs">
                <span
                    className={`tab ${filter === 'today' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('today')}
                >Today</span>
                <span
                    className={`tab ${filter === 'yesterday' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('yesterday')}
                >Yesterday</span>
                <span
                    className={`tab ${filter === 'last7days' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('last7days')}
                >Last 7 days</span>
                <span
                    className={`tab ${filter === 'thisMonth' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('thisMonth')}
                >This month</span>
                <span
                    className={`tab ${filter === 'lastMonth' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('lastMonth')}
                >Last month</span>
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
                            {paginatedPurchases.map((item) => {
                                const total = item.items.reduce((sum, i) => sum + (i.quantity * i.cost_price), 0);
                                return (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td className="date-link">{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>{item.supplier?.name || 'N/A'}</td>
                                        <td>${total.toFixed(2)}</td>
                                        <td><span className="type-label single">Single</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <span
                            className={`nav-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                        >
                            ← Previous
                        </span>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <span
                                    key={pageNum}
                                    className={currentPage === pageNum ? 'active' : ''}
                                    onClick={() => goToPage(pageNum)}
                                >
                                    {pageNum}
                                </span>
                            );
                        })}

                        <span
                            className={`nav-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                        >
                            Next →
                        </span>
                    </div>

                </>
            )}

            {showPopup && (
                <PurchasePopup
                    onClose={() => setShowPopup(false)}
                    onSuccess={loadPurchases}
                />
            )}
        </div>
    );
};

export default PurchaseTable;
