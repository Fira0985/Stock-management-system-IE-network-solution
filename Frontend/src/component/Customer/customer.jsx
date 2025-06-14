import React from "react";
import "./customer.css";

const Customer = ( { isSidebarOpen } ) => {
    const customers = [
        { id: "#2001", name: "Alemu Tesfaye", phone: "+251912345678", address: "Addis Ababa", creditLimit: "20,000" },
        { id: "#2002", name: "Saron Mekonnen", phone: "+251911223344", address: "Adama", creditLimit: "15,000" },
        { id: "#2003", name: "Mulugeta T.", phone: "+251934567890", address: "Bahir Dar", creditLimit: "25,000" },
        { id: "#2004", name: "Lensa Yilma", phone: "+251910111213", address: "Hawassa", creditLimit: "18,500" },
        { id: "#2005", name: "Binyam Asefa", phone: "+251987654321", address: "Mekelle", creditLimit: "22,000" },
    ];

    return (
        <div className={isSidebarOpen? "customer-content": "customer-content collapse"}>
            <div className="customer-header">
                <h2>All Customers</h2>
                <button className="add-customer">New Customer</button>
            </div>

            <div className="customer-table">
                <div className="customer-row header">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Phone</span>
                    <span>Address</span>
                    <span>Credit Limit</span>
                    <span>Actions</span>
                </div>

                {customers.map((customer) => (
                    <div className="customer-row" key={customer.id}>
                        <span>{customer.id}</span>
                        <span>{customer.name}</span>
                        <span>{customer.phone}</span>
                        <span>{customer.address}</span>
                        <span>{customer.creditLimit}</span>
                        <span className="dots">⋯</span>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <span className="disabled">← Previous</span>
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
                <span>10</span>
                <span>Next →</span>
            </div>
        </div>
    );
};

export default Customer;
