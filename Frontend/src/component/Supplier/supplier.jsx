import React, { useEffect, useState } from "react";
import {
    fetchNonUser,
    addNonUser,
    editNonUser,
    deleteNonUser,
} from "../../services/nonUserService";
import { exportSuppliers } from "../../services/exportService";
import AddSupplierForm from "./AddSupplierForm";
import EditSupplierForm from "./EditSupplierForm";
import DeleteSupplierForm from "./DeleteSupplierForm";
import "./supplier.css";
import { FiDownload } from "react-icons/fi";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Supplier = ({ isSidebarOpen }) => {
    const [suppliers, setsuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [menuIndex, setMenuIndex] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const suppliersPerPage = 5;

    const loadsuppliers = async () => {
        try {
            const suppliersData = await fetchNonUser("SUPPLIER");
            setsuppliers(suppliersData);
        } catch (err) {
            console.error("Failed to load suppliers:", err.message);
            toast.error("Failed to load suppliers");
        }
    };

    useEffect(() => {
        loadsuppliers();
    }, []);

    const handleAddSupplier = async (data) => {
        try {
            await addNonUser({ ...data, type: "SUPPLIER" });
            await loadsuppliers();
            setShowAddModal(false);
            toast.success("Supplier added successfully");
        } catch (err) {
            console.error("Add supplier failed:", err.message);
            toast.error(err.message || "Failed to add supplier");
        }
    };

    const handleEditSupplier = async (id, data) => {
        try {
            await editNonUser(id, { ...data, id, type: "SUPPLIER" });
            await loadsuppliers();
            setShowEditModal(false);
            toast.success("Supplier updated successfully");
        } catch (err) {
            console.error("Edit supplier failed:", err.message);
            toast.error(err.message || "Failed to update supplier");
        }
    };

    const handleDeleteSupplier = async (id) => {
        try {
            await deleteNonUser(id);
            await loadsuppliers();
            setShowDeleteModal(false);
            toast.success("Supplier deleted successfully");
        } catch (err) {
            console.error("Delete supplier failed:", err.message);
            toast.error(err.message || "Failed to delete supplier");
        }
    };

    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setShowEditModal(true);
    };

    const handleDeleteClick = (supplier) => {
        setSelectedSupplier(supplier);
        setShowDeleteModal(true);
    };

    const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
    const paginatedsuppliers = suppliers.slice(
        (currentPage - 1) * suppliersPerPage,
        currentPage * suppliersPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div
            className={isSidebarOpen ? "sp-supplier-content" : "sp-supplier-content sp-collapse"}
            onClick={() => setMenuIndex(null)}
        >
            <div className="sp-supplier-header">
                <h2>All suppliers</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="sp-add-supplier" onClick={() => setShowAddModal(true)}>
                        New Supplier
                    </button>
                    <button
                        className="sp-export-btn"
                        onClick={() => exportSuppliers(suppliers)}
                    >
                        <FiDownload style={{ marginRight: 4 }} />
                        Export
                    </button>
                </div>
            </div>

            <div className="sp-supplier-table">
                <div className="sp-supplier-row sp-header">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Phone</span>
                    <span>Address</span>
                    <span>Actions</span>
                </div>

                {paginatedsuppliers.map((supplier, index) => (
                    <div className="sp-supplier-row" key={supplier.id}>
                        <span>#{supplier.id}</span>
                        <span>{supplier.name}</span>
                        <span>{supplier.phone}</span>
                        <span>{supplier.address}</span>
                        <span
                            className="sp-dots"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuIndex(menuIndex === index ? null : index);
                            }}
                        >
                            ⋯
                            {menuIndex === index && (
                                <div className="sp-popup-menu">
                                    <div
                                        className="sp-popup-item sp-edit-item"
                                        onClick={() => handleEditClick(supplier)}
                                    >
                                        Edit
                                    </div>
                                    <div
                                        className="sp-popup-item sp-delete-item"
                                        onClick={() => handleDeleteClick(supplier)}
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
                <AddSupplierForm
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddSupplier}
                />
            )}

            {showEditModal && selectedSupplier && (
                <EditSupplierForm
                    nonUser={selectedSupplier}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={(data) => handleEditSupplier(selectedSupplier.id, data)}
                />
            )}

            {showDeleteModal && selectedSupplier && (
                <DeleteSupplierForm
                    supplier={selectedSupplier}
                    onDelete={handleDeleteSupplier}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Supplier;
