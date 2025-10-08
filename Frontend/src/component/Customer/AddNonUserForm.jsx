import React, { useState } from "react";
import "./form.css";
import { validateLetters, validatePhoneNumber, validatePositiveNumber } from "../../utils/validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNonUserForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        credit_limit: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Name validation
        if (!formData.name.trim()) {
            toast.error("Customer name is required");
            return;
        }
        if (!validateLetters(formData.name)) {
            toast.error("Customer name must contain letters only");
            return;
        }

        // Address validation
        if (!formData.address.trim()) {
            toast.error("Address is required");
            return;
        }

        // Phone validation 
        if (formData.phone && !validatePhoneNumber(formData.phone)) {
            toast.error("Invalid phone number");
            return;
        }

        // Credit Limit validation
        if (!formData.credit_limit) {
            toast.error("Credit limit is required");
            return;
        }

        // All validations passed
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add New Customer</h3>
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
                    <input
                        type="number"
                        name="credit_limit"
                        placeholder="Credit Limit"
                        value={formData.credit_limit}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <button type="submit">Add</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
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

export default AddNonUserForm;
