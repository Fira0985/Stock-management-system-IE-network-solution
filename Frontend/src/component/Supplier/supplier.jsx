import React from 'react';
import './supplier.css';

const SupplierList = ( { isSidebarOpen } ) => {
    const suppliers = [
        { id: '#1023', name: 'Cindy Morris', address: 'Addis', phone: '+2510393234', email: '' },
        { id: '#1022', name: 'Wade Warren', address: 'Bahrdar', phone: '+2510393234', email: '' },
        { id: '#1021', name: 'Grace Johnson', address: 'Ambo', phone: '+2510393234', email: '' },
        { id: '#1020', name: 'Mike Smith', address: 'Adama', phone: '+2510393234', email: '' },
        { id: '#1019', name: 'Sarah Brown', address: 'Hawasa', phone: '+2510393234', email: '' },
    ];

    return (
        <div className={isSidebarOpen? "supplier-content": "supplier-content collapse"}>
            <div className="supplier-header">
                <h2>All Suppliers</h2>
                <button className="new-supplier-btn">New Supplier</button>
            </div>

            <div className="supplier-table">
                <div className="supplier-row supplier-header-row">
                    <span>SupplierID</span>
                    <span>Supplier Name</span>
                    <span>Address</span>
                    <span>Phone Number</span>
                    <span>Email</span>
                    <span></span>
                </div>

                {suppliers.map((supplier, index) => (
                    <div className="supplier-row" key={index}>
                        <span>{supplier.id}</span>
                        <span>{supplier.name}</span>
                        <span>{supplier.address}</span>
                        <span>{supplier.phone}</span>
                        <span>{supplier.email}</span>
                        <span className="menu-dots">⋯</span>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <span className="disabled">← Previous</span>
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>…</span>
                <span>67</span>
                <span>68</span>
                <span>Next →</span>
            </div>
        </div>
    );
};

export default SupplierList;
