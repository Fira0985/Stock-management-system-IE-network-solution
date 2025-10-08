import React, { useState } from "react";
import "./form.css";
import { validateLetters, validatePhoneNumber, validatePositiveNumber } from "../../utils/validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditNonUserForm = ({ nonUser, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: nonUser.name || "",
        address: nonUser.address || "",
        phone: nonUser.phone || "",
        credit_limit: nonUser.credit_limit || "",
        type: "CUSTOMER",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "credit_limit" ? (value === "" ? "" : parseFloat(value)) : value
        }));
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

        // Phone validation (optional)
        if (formData.phone && !validatePhoneNumber(formData.phone)) {
            toast.error("Invalid phone number");
            return;
        }

        // Credit Limit validation
        if (formData.credit_limit === "" || formData.credit_limit === null) {
            toast.error("Credit limit is required");
            return;
        }
        if (!validatePositiveNumber(formData.credit_limit)) {
            toast.error("Credit limit must be a positive number greater than 0");
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Customer</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                    />
                    <input
                        type="number"
                        name="credit_limit"
                        value={formData.credit_limit}
                        onChange={handleChange}
                        placeholder="Credit Limit"
                    />

                    <div className="form-actions">
                        <button type="submit">Update</button>
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

export default EditNonUserForm;
