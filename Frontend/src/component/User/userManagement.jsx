import React, { useState, useEffect, useRef } from 'react';
import './userManagement.css';
import UserForm from './UserForm';
import ConfirmDelete from './ConfirmDelete';
import { fetchUsers, addUser, editUser, deleteUser } from '../../services/userService';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 3;

const UserManagement = ({ isSidebarOpen, currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [menuIndex, setMenuIndex] = useState(null);
    const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
    const [activeUser, setActiveUser] = useState(null);
    const [error, setError] = useState(null);
    const menuRefs = useRef([]);

    const loadUsers = async () => {
        try {
            setError(null);
            const res = await fetchUsers();

            // Filter out users with role 'OWNER'
            const filteredUsers = res.data.filter(user => user.role !== 'OWNER');

            setUsers(filteredUsers);
        } catch (err) {
            if (err.message === 'Authentication token not found' || err.response?.status === 401) {
                setError('Session expired or unauthorized. Please login again.');
                localStorage.removeItem('authToken');
            } else {
                setError('Failed to load users.');
            }
            console.error('Failed to load users', err);
        }
    };


    useEffect(() => {
        loadUsers();
    }, []);

    const closeModal = () => {
        setModalType(null);
        setActiveUser(null);
    };

    const handleAdd = async (form) => {
        try {
            setError(null);
            // password must be included in form, phone can be optional
            await addUser({
                ...form,
                created_by_id: currentUserId,
            });
            await loadUsers();
            closeModal();
            toast.success('User added successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add user');
        }
    };


    const handleEdit = async (form) => {
        try {
            setError(null);
            await editUser(form);
            await loadUsers();
            closeModal();
            toast.success('User updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDelete = async (user) => {
        try {
            setError(null);
            await deleteUser(user.email, currentUserId);

            // Reload users first
            const res = await fetchUsers();
            const filteredUsers = res.data.filter(u => u.role !== 'OWNER');
            const totalUsers = filteredUsers.length;

            // Compute new total page count after deletion
            const newPageCount = Math.ceil(totalUsers / PAGE_SIZE);

            // If current page becomes empty (e.g., only 1 user was there and deleted), go back one page
            if ((currentPage > newPageCount) && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

            setUsers(filteredUsers);
            closeModal();
            toast.success('User deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete user');
        }
    };


    const stopPropagation = (e) => e.stopPropagation();

    // Pagination
    const pageCount = Math.ceil(users.length / PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);
    const pagedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className={isSidebarOpen ? 'user-content' : 'user-content collapse'}>
            <div className="user-header">
                <h2>User Management</h2>
                <button className="add-user-btn" onClick={() => setModalType('add')}>Add User</button>
            </div>

            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '1em' }}>
                    {error}
                </div>
            )}

            <div className="user-table" onClick={() => setMenuIndex(null)}>
                <div className="user-row user-header-row">
                    <span>User ID</span><span>Name</span><span>Email</span>
                    <span>Role</span><span>Last Login</span><span>Phone</span><span></span>
                </div>

                {pagedUsers.map((user, index) => (
                    <div className="user-row" key={user.email}>
                        <span>{user.id}</span>
                        <span>{user.username}</span>
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                        <span>{new Date(user.lastLogin).toLocaleString()}</span>
                        <span>{user.phone}</span>
                        <span className="menu-container" ref={el => menuRefs.current[index] = el} onClick={stopPropagation}>
                            <span className="menu-dots" onClick={() => setMenuIndex(menuIndex === index ? null : index)}>⋯</span>
                            {menuIndex === index && (
                                <div className="popup-menu">
                                    <div
                                        className="popup-item"
                                        onClick={() => { setActiveUser(user); setModalType('edit'); setMenuIndex(null); }}
                                    >Edit</div>
                                    <div
                                        className="popup-item"
                                        onClick={() => { setActiveUser(user); setModalType('delete'); setMenuIndex(null); }}
                                    >Delete</div>
                                </div>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {pageCount > 1 && (
                <div className="pagination">
                    <span
                        className={currentPage === 1 ? 'disabled' : ''}
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    >← Previous</span>
                    {Array.from({ length: pageCount }, (_, i) => (
                        <span
                            key={i + 1}
                            className={currentPage === i + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(i + 1)}
                        >{i + 1}</span>
                    ))}
                    <span
                        className={currentPage === pageCount ? 'disabled' : ''}
                        onClick={() => currentPage < pageCount && setCurrentPage(currentPage + 1)}
                    >Next →</span>
                </div>
            )}

            {modalType === 'add' && (
                <UserForm onClose={closeModal} onSubmit={handleAdd} />
            )}

            {modalType === 'edit' && activeUser && (
                <UserForm
                    onClose={closeModal}
                    onSubmit={handleEdit}
                    initialData={{
                        email: activeUser.email,
                        phone: activeUser.phone,
                        role: activeUser.role,
                        username: activeUser.username,
                    }}
                    isEdit
                />
            )}


            {modalType === 'delete' && activeUser && (
                <ConfirmDelete onClose={closeModal} onConfirm={handleDelete} user={activeUser} />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UserManagement;
