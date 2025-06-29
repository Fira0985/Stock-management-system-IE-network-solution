import React from 'react';
import './purchase.css';

const purchases = [
    { id: '#1023', date: 'Jun 23, 2023', supplier: 'Cindy Morris', amount: '$120', type: 'Single' },
    { id: '#1022', date: 'Jun 22, 2023', supplier: 'Wade Warren', amount: '$60', type: 'Single' },
    { id: '#1021', date: 'Jun 21, 2023', supplier: 'Grace Johnson', amount: '$90', type: 'Single' },
    { id: '#1020', date: 'Jun 20, 2023', supplier: 'Mike Smith', amount: '$3000', type: 'Bulk' },
    { id: '#1019', date: 'Jun 19, 2023', supplier: 'Sarah Brown', amount: '$100', type: 'Single' },
];

const PurchaseTable = ({ isSidebarOpen }) => {
    return (
        <div className={isSidebarOpen ? "purchase-container" : "purchase-container collapse"}>
            <div className="header-section">
                <h2 className="page-title">All Purchases</h2>
                <button className="purchase-btn">Purchase</button>
            </div>

            <div className="tabs">
                <span className="tab active">Today</span>
                <span className="tab">Yesterday</span>
                <span className="tab">Last 7 days</span>
                <span className="tab">This month</span>
                <span className="tab">Last month</span>
            </div>

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
                    {purchases.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td className="date-link">{item.date}</td>
                            <td>{item.supplier}</td>
                            <td>{item.amount}</td>
                            <td>
                                <span className={`type-label ${item.type.toLowerCase()}`}>
                                    {item.type}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="custom-pagination">
                <span className="nav-arrow disabled">← Previous</span>
                <span className="page-circle active">1</span>
                <span className="page-circle">2</span>
                <span className="page-circle">3</span>
                <span className="ellipsis">...</span>
                <span className="page-circle">68</span>
                <span className="nav-arrow">Next →</span>
            </div>
        </div>
    );
};

export default PurchaseTable;
