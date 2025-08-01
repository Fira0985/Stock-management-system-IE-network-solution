import React, { useEffect, useState } from "react";
import {
    fetchNonUser,
    addNonUser,
    editNonUser,
    deleteNonUser,
} from "../../services/nonUserService";
import { exportCustomers } from "../../services/exportService";
import AddNonUserForm from "./AddNonUserForm";
import EditNonUserForm from "./EditNonUserForm";
import DeleteCustomerForm from "./DeleteCustomerForm";
import "./customer.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiDownload } from "react-icons/fi";

const Customer = ({ isSidebarOpen }) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [menuIndex, setMenuIndex] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const customersPerPage = 5;

    const loadCustomers = async () => {
        try {
            const customersData = await fetchNonUser("CUSTOMER");
            setCustomers(customersData);
        } catch (err) {
            console.error("Failed to load customers:", err.message);
            toast.error("Failed to load customers");
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleaddNonUser = async (data) => {
        try {
            await addNonUser({ ...data, type: "CUSTOMER" });
            await loadCustomers();
            setShowAddModal(false);
            toast.success("Customer added successfully");
        } catch (err) {
            console.error("Add customer failed:", err.message);
            toast.error(err.message || "Failed to add customer");
        }
    };

    const handleeditNonUser = async (id, data) => {
        try {
            await editNonUser(id, { ...data, id, type: "CUSTOMER" });
            await loadCustomers();
            setShowEditModal(false);
            toast.success("Customer updated successfully");
        } catch (err) {
            console.error("Edit customer failed:", err.message);
            toast.error(err.message || "Failed to update customer");
        }
    };

    const handledeleteNonUser = async (id) => {
        try {
            await deleteNonUser(id);
            await loadCustomers();
            setShowDeleteModal(false);
            toast.success("Customer deleted successfully");
        } catch (err) {
            console.error("Delete failed:", err.message);
            toast.error(err.message || "Failed to delete customer");
        }
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    };

    const handleDeleteClick = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
    };

    // Pagination logic
    const totalPages = Math.ceil(customers.length / customersPerPage);
    const paginatedCustomers = customers.slice(
        (currentPage - 1) * customersPerPage,
        currentPage * customersPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div
            className={isSidebarOpen ? "cs-customer-content" : "cs-customer-content cs-collapse"}
            onClick={() => setMenuIndex(null)}
        >
            <div className="cs-customer-header">
                <h2>All Customers</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="cs-add-customer" onClick={() => setShowAddModal(true)}>
                        New Customer
                    </button>
                    <button
                        className="cs-export-btn"
                        onClick={() => exportCustomers(customers)}
                    >
                        <FiDownload style={{ marginRight: 4 }} />
                        Export
                    </button>
                </div>
            </div>

            <div className="cs-customer-table">
                <div className="cs-customer-row cs-header">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Phone</span>
                    <span>Address</span>
                    <span>Credit Limit</span>
                    <span>Actions</span>
                </div>

                {paginatedCustomers.map((customer, index) => (
                    <div className="cs-customer-row" key={customer.id}>
                        <span>#{customer.id}</span>
                        <span>{customer.name}</span>
                        <span>{customer.phone}</span>
                        <span>{customer.address}</span>
                        <span>{customer.credit_limit?.toLocaleString()}</span>
                        <span
                            className="cs-dots"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuIndex(menuIndex === index ? null : index);
                            }}
                        >
                            ⋯
                            {menuIndex === index && (
                                <div className="cs-popup-menu">
                                    <div
                                        className="cs-popup-item cs-edit-item"
                                        onClick={() => handleEditClick(customer)}
                                    >
                                        Edit
                                    </div>
                                    <div
                                        className="cs-popup-item cs-delete-item"
                                        onClick={() => handleDeleteClick(customer)}
                                    >
                                        Delete
                                    </div>
                                </div>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <span
                    className={currentPage === 1 ? "disabled" : ""}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    ← Previous
                </span>

                {Array.from({ length: totalPages }, (_, i) => (
                    <span
                        key={i + 1}
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </span>
                ))}

                <span
                    className={currentPage === totalPages ? "disabled" : ""}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    Next →
                </span>
            </div>

            {showAddModal && (
                <AddNonUserForm
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleaddNonUser}
                />
            )}

            {showEditModal && selectedCustomer && (
                <EditNonUserForm
                    nonUser={selectedCustomer}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={(data) => handleeditNonUser(selectedCustomer.id, data)}
                />
            )}

            {showDeleteModal && selectedCustomer && (
                <DeleteCustomerForm
                    customer={selectedCustomer}
                    onDelete={handledeleteNonUser}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Customer;
