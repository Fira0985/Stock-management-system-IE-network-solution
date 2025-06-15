import React, { useState } from 'react';
import './userForm.css'; 
const UserForm = ({ onClose, onSubmit, initialData = {}, isEdit = false }) => {
    const [form, setForm] = useState({
        username: initialData.username || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!isEdit && !form.username) newErrors.username = 'Username is required';
        if (!isEdit && !form.email) newErrors.email = 'Email is required';
        if (!form.role) newErrors.role = 'Role is required';
        if (!isEdit && !form.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const payload = isEdit
                ? { email: form.email, phone: form.phone, role: form.role }
                : form;
            onSubmit(payload);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isEdit ? 'Edit User' : 'Add User'}</h2>

                <form onSubmit={handleSubmit}>
                    {!isEdit && (
                        <>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.username && <div className="error-text">{errors.username}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <div className="error-text">{errors.email}</div>}
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select a role</option>
                            <option value="OWNER">OWNER</option>
                            <option value="CLERK">CLERK</option>
                            <option value="AUDITOR">AUDITOR</option>
                        </select>
                        {errors.role && <div className="error-text">{errors.role}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone (optional):</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Optional"
                        />
                    </div>

                    {!isEdit && (
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit">{isEdit ? 'Update' : 'Add'} User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
