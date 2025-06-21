import React, { useState } from "react";

const EditSupplierForm = ({ nonUser, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: nonUser.name || "",
        address: nonUser.address || "",
        phone: nonUser.phone || "",
        type: "SUPPLIER",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]
                : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="supplier-modal-overlay">
            <div className="supplier-modal">
                <h3>Edit Supplier</h3>
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

                    <button type="submit">Update</button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditSupplierForm;
