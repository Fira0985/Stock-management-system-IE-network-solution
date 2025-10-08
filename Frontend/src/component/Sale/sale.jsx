import React, { useEffect, useState, useMemo } from 'react';
import './sale.css';
import { fetchAllSales } from '../../services/saleService';
import { fetchAllProducts } from '../../services/productService';
import { fetchNonUser } from '../../services/nonUserService';
import NewSaleForm from './newSaleForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiDownload } from 'react-icons/fi';
import { exportSales } from "../../services/exportService";

const ITEMS_PER_PAGE = 5;

const Sales = ({ isSidebarOpen }) => {
    const [allSales, setAllSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('today');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const loadSales = async () => {
        setLoading(true);
        try {
            const data = await fetchAllSales();
            setAllSales(data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading sales:', err);
            setError('Failed to load sales.');
            setAllSales([]);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await fetchAllProducts();
            setProducts(data);
        } catch (e) {
            toast.error("Failed to load products");
        }
    };

    const loadCustomers = async () => {
        try {
            const data = await fetchNonUser('CUSTOMER');
            setCustomers(data);
        } catch (e) {
            toast.error("Failed to load customers");
        }
    };

    useEffect(() => {
        loadSales();
        loadProducts();
        loadCustomers();
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
            case 'last7':
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
            case 'all':
                // For "All", return null to indicate no date filtering
                return { start: null, end: null };
            default:
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    };

    const filteredSales = useMemo(() => {
        const { start, end } = getDateRange(filter);
        
        // If filter is 'all', return all sales without date filtering
        if (filter === 'all') {
            return allSales;
        }
        
        return allSales.filter(sale => {
            const date = new Date(sale.created_at);
            return date >= start && date <= end;
        });
    }, [allSales, filter]);

    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSales.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredSales, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={isSidebarOpen ? "sales-container" : "sales-container collapse"}>
            <div className="header-section">
                <h2 className="page-title">All Sales</h2>
                <div className="buttonCont" style={{ display: "flex", gap: "10px" }}>
                    <button className="sale-btn" onClick={() => setShowForm(true)}>New Sale</button>
                    <button
                        className="sale-export-btn"
                        onClick={() => exportSales(allSales)}
                    >
                        <FiDownload style={{ marginRight: 4 }} />
                        Export
                    </button>
                </div>
            </div>

            <div className="tabs">
                {['all', 'today', 'yesterday', 'last7', 'thisMonth', 'lastMonth'].map(f => (
                    <span
                        key={f}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        onClick={() => { setFilter(f); setCurrentPage(1); }}
                    >
                        {f === 'all' ? 'All' :
                         f === 'today' ? 'Today' :
                         f === 'yesterday' ? 'Yesterday' :
                         f === 'last7' ? 'Last 7 days' :
                         f === 'thisMonth' ? 'This month' : 'Last month'}
                    </span>
                ))}
            </div>

            {loading ? (
                <p>Loading sales...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : filteredSales.length === 0 ? (
                <p>No sales found in this period.</p>
            ) : (
                <>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Sale ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSales.map(sale => (
                                <tr key={sale.id} onClick={() => setSelectedSale(sale)}>
                                    <td>#{sale.id}</td>
                                    <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                    <td>{sale.customer?.name || 'N/A'}</td>
                                    <td>${sale.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`type-label ${sale.type.toLowerCase()}`}>
                                            {sale.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <span
                            className={currentPage === 1 ? 'disabled' : ''}
                            onClick={() => goToPage(currentPage - 1)}
                        >← Previous</span>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <span
                                key={i + 1}
                                className={currentPage === i + 1 ? 'active' : ''}
                                onClick={() => goToPage(i + 1)}
                            >{i + 1}</span>
                        ))}
                        <span
                            className={currentPage === totalPages ? 'disabled' : ''}
                            onClick={() => goToPage(currentPage + 1)}
                        >Next →</span>
                    </div>
                </>
            )}

            {showForm && (
                <NewSaleForm
                    products={products}
                    customers={customers}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        loadSales();
                        setShowForm(false);
                        toast.success("Sale added successfully");
                    }}
                />
            )}

            {selectedSale && (
                <div className="popup-overlay" onClick={() => setSelectedSale(null)}>
                    <div className="popup-box-sale" onClick={e => e.stopPropagation()}>
                        <div className="popup-header">
                            <h3>Sale #{selectedSale.id} Details</h3>
                            <button className="close-sale-detail" onClick={() => setSelectedSale(null)}>×</button>
                        </div>
                        <div className="popup-body">
                            <p><strong>Customer:</strong> {selectedSale.customer?.name || 'N/A'}</p>
                            <p><strong>Date:</strong> {new Date(selectedSale.created_at).toLocaleString()}</p>
                            <h4>Items:</h4>
                            <ul>
                                {selectedSale.items?.map((item, index) => (
                                    <li key={index}>
                                        {item.product?.name || 'Unknown'} – {item.quantity} × ${item.unit_price}
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
export default Sales;