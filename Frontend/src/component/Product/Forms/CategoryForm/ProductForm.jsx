import React, { useState } from 'react';
import './ProductForm.css';
import { validateLetters } from '../../../../utils/validators'; // import reusable validator
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = ({ onClose, onSubmit, initialData = {}, isEdit = false }) => {
    const [form, setForm] = useState({
        name: initialData.name || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if name is empty
        if (!form.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        // Check if name contains only letters
        if (!validateLetters(form.name)) {
            toast.error('Category name must contain letters only');
            return;
        }

        // All validations passed
        onSubmit(form);
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
                        <label htmlFor="name">
                            Category Name<span className="required">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {isEdit ? 'Update' : 'Add'} Category
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </div>
    );
};

export default ProductForm;
