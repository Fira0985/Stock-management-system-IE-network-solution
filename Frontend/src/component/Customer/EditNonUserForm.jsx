import React, { useState } from "react";

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

        setFormData((prev) => ({
            ...prev,
            [name]: name === "credit_limit"
                ? (value === "" ? "" : parseFloat(value)) // parse as float
                : value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Edit Customer</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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

                    <label htmlFor="credit_limit">Credit Limit:</label>
                    <input
                        id="credit_limit"
                        type="number"
                        name="credit_limit"
                        value={formData.credit_limit}
                        onChange={handleChange}
                        min="0"
                    />

                    <button type="submit">Update</button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditNonUserForm;