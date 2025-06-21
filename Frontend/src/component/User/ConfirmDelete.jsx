import React from 'react';
import './userForm.css';

const ConfirmDelete = ({ onClose, onConfirm, user }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content delete" onClick={e => e.stopPropagation()}>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete <strong>{user.email}</strong>?</p>
                <div className="form-actions">
                    <button onClick={() => onConfirm(user)}>Yes, Delete</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
