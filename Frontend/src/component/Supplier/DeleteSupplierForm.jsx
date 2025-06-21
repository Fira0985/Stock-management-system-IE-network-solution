import React from "react";
import "./form.css";

const DeleteSupplierForm = ({ supplier, onDelete, onClose }) => {
    return (
        <div className="supplier-modal-overlay">
            <div className="supplier-modal">
                <h3>Delete Supplier</h3>
                <p>Are you sure you want to delete <strong>{supplier.name}</strong>?</p>
                <div className="modal-actions">
                    <button onClick={() => onDelete(supplier.id)}>Yes, Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSupplierForm;
