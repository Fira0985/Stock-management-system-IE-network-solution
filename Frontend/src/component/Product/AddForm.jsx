import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const AddForm = ({ categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        sale_price: '',
        cost_price: '',
        category: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.sale_price || !formData.cost_price || !formData.category) {
            alert('Please fill in all required fields.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label>Product Name <span>*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sale Price <span>*</span></label>
                        <input
                            type="number"
                            name="sale_price"
                            value={formData.sale_price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Cost Price <span>*</span></label>
                        <input
                            type="number"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category <span>*</span></label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Add Product</button>
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddForm;
