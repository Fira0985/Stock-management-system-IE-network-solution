import React from "react";
import "./form.css";

const DeleteCustomerForm = ({ customer, onDelete, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Delete Customer</h3>
                <p>Are you sure you want to delete <strong>{customer.name}</strong>?</p>
                <div className="modal-actions">
                    <button onClick={() => onDelete(customer.id)}>Yes, Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCustomerForm;
