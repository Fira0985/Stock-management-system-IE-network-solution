import React, { useState } from "react";
import "./form.css";
import { validateLetters, validatePhoneNumber } from "../../utils/validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSupplierForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
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

        // Everything is valid
        onSubmit(formData);
    };

    return (
        <div className="supplier-modal-overlay" onClick={onClose}>
            <div className="supplier-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add New Supplier</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <button type="submit">Add</button>
                        <button type="button" className="cancel-button" onClick={onClose}>
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

export default AddSupplierForm;
