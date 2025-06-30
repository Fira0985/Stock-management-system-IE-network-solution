import React, { useEffect, useState } from 'react';
import './sale.css';
import { fetchAllSales, addSale } from '../../services/saleService';
import { fetchAllProducts } from '../../services/productService';
import { fetchNonUser } from '../../services/nonUserService';
import NewSaleForm from './newSaleForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sales = ({ isSidebarOpen }) => {
    const [allSalesData, setAllSalesData] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('today');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);

    const pageSize = 5;
    const totalPages = Math.ceil(filteredSales.length / pageSize);
    const paginatedSales = filteredSales.slice((page - 1) * pageSize, page * pageSize);

    const calculateDateRange = (filter) => {
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
            default:
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
        }

        return { startDate: start, endDate: end };
    };

    const filterSales = (tab) => {
        const { startDate, endDate } = calculateDateRange(tab);
        setFilteredSales(
            allSalesData.filter(sale => {
                const d = new Date(sale.created_at);
                return d >= startDate && d <= endDate;
            })
        );
    };

    const loadProducts = async () => {
        try {
            const data = await fetchAllProducts();
            setProducts(data);
        } catch (e) {
            console.error("Failed to load products", e);
            toast.error("Failed to load products");
        }
    };

    const loadCustomers = async () => {
        try {
            const data = await fetchNonUser('CUSTOMER');
            setCustomers(data);
        } catch (e) {
            console.error("Failed to load customers", e);
            toast.error("Failed to load customers");
        }
    };

    const loadSales = async () => {
        setLoading(true);
        try {
            const sales = await fetchAllSales();
            setAllSalesData(sales);
            filterSales(activeTab);
        } catch (err) {
            toast.error("Failed to load sales");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSales();
        loadProducts();
        loadCustomers();
    }, []);

    useEffect(() => {
        filterSales(activeTab);
        setPage(1);
    }, [activeTab, allSalesData]);

    return (
        <div className={isSidebarOpen ? 'sales-container' : 'sales-container collapse'}>
            <div className="header-section">
                <h2 className="page-title">All Sales</h2>
                <div>
                    <button className="sale-btn normal" onClick={() => setShowForm(true)}>Normal Sale</button>
                </div>
            </div>

            <div className="tabs">
                {['today', 'yesterday', 'last7', 'thisMonth', 'lastMonth'].map(tab => (
                    <div key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'today' ? 'Today'
                            : tab === 'yesterday' ? 'Yesterday'
                                : tab === 'last7' ? 'Last 7 days'
                                    : tab === 'thisMonth' ? 'This month'
                                        : 'Last month'}
                    </div>
                ))}
            </div>

            {loading && <p>Loading sales...</p>}

            {!loading &&
                <>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>SALE ID</th><th>DATE</th><th>CUSTOMER</th><th>AMOUNT</th><th>TYPE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSales.map(sale => (
                                <tr key={sale.id}>
                                    <td>#{sale.id}</td>
                                    <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                    <td>{sale.customer?.name || 'N/A'}</td>
                                    <td>${sale.total.toFixed(2)}</td>
                                    <td><span className={`type-label ${sale.type.toLowerCase()}`}>{sale.type}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 &&
                        <div className="custom-pagination">
                            <div className={`nav-arrow ${page === 1 ? 'disabled' : ''}`}
                                onClick={() => page > 1 && setPage(page - 1)}>← Previous</div>
                            {[...Array(totalPages)].map((_, i) => (
                                <div key={i}
                                    className={`page-circle ${page === i + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(i + 1)}>{i + 1}</div>
                            ))}
                            <div className={`nav-arrow ${page === totalPages ? 'disabled' : ''}`}
                                onClick={() => page < totalPages && setPage(page + 1)}>Next →</div>
                        </div>
                    }
                </>
            }

            {showForm &&
                <NewSaleForm
                    products={products}
                    customers={customers}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        toast.success('Sale successfully created');
                        loadSales();
                        setShowForm(false);
                    }}
                />
            }

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Sales;
