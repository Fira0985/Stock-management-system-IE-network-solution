import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ onClose, onSubmit, initialData = {}, isEdit = false }) => {
    const [form, setForm] = useState({
        name: initialData.name || '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(form);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={isEdit ? "modal-content-edits" : "modal-content"}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{isEdit ? 'Edit Category' : 'Add Category'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Category Name<span className="required">*</span></label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />
                        {errors.name && <div className="error-text">{errors.name}</div>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {isEdit ? 'Update' : 'Add'} Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
