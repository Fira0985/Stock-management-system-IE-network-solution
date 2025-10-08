import React, { useState } from "react";
import "./form.css";
import { validateLetters, validatePhoneNumber } from "../../utils/validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSupplierForm = ({ nonUser, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: nonUser.name || "",
        address: nonUser.address || "",
        phone: nonUser.phone || "",
        type: "SUPPLIER",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Name validation
        if (!formData.name.trim()) {
            toast.error("Supplier name is required");
            return;
        }
        if (!validateLetters(formData.name)) {
            toast.error("Supplier name must contain letters only");
            return;
        }

        // Address validation
        if (!formData.address.trim()) {
            toast.error("Address is required");
            return;
        }

        // Phone validation (optional)
        if (formData.phone && !validatePhoneNumber(formData.phone)) {
            toast.error("Invalid phone number");
            return;
        }

        // All validations passed
        onSubmit(formData);
    };

    return (
        <div className="supplier-modal-overlay" onClick={onClose}>
            <div className="supplier-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Supplier</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="phone">Phone:</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <label htmlFor="address">Address:</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <button type="submit">Update</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Toast notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
            </div>
        </div>
    );
};

export default EditSupplierForm;
