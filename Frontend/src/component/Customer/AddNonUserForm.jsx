import React, { useState } from "react";
import "./form.css";

const AddNonUserForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        credit_limit: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Add New Customer</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                    <input type="number" name="credit_limit" placeholder="Credit Limit" onChange={handleChange} />
                    <button type="submit">Add</button>
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddNonUserForm;
