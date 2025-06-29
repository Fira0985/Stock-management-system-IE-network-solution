import React from 'react';
import './ProductForm.css';

const DeleteProductForm = ({ onClose, onConfirm, Category }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content delete" onClick={e => e.stopPropagation()}>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete <strong>{Category.name}</strong>?</p>
                <div className="form-actions">
                    <button onClick={() => onConfirm(Category)}>Yes, Delete</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductForm;
