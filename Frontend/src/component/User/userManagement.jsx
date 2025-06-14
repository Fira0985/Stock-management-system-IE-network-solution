import React from 'react';
import './userManagement.css';

const UserManagement = ( { isSidebarOpen } ) => {
    const users = [
        {
            id: '#U001',
            name: 'Cindy Morris',
            email: 'cindy@example.com',
            role: 'Admin',
            lastLogin: '2025-06-13 14:30',
            phone: '+251901234567',
        },
        {
            id: '#U002',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Staff',
            lastLogin: '2025-06-13 11:20',
            phone: '+251911112233',
        },
        {
            id: '#U003',
            name: 'Alice Smith',
            email: 'alice@example.com',
            role: 'Viewer',
            lastLogin: '2025-06-12 09:15',
            phone: '+251922334455',
        } ,
        {
            id: '#U002',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Staff',
            lastLogin: '2025-06-13 11:20',
            phone: '+251911112233',
        }
    ];

    return (
        <div className={isSidebarOpen? "user-content": "user-content collapse"}>
            <div className="user-header">
                <h2>User Management</h2>
                <button className="add-user-btn">Add User</button>
            </div>

            <div className="user-table">
                <div className="user-row user-header-row">
                    <span>User ID</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Last Login</span>
                    <span>Phone</span>
                    <span></span>
                </div>

                {users.map((user, index) => (
                    <div className="user-row" key={index}>
                        <span>{user.id}</span>
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                        <span>{user.lastLogin}</span>
                        <span>{user.phone}</span>
                        <span className="menu-dots">⋯</span>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <span className="disabled">← Previous</span>
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>…</span>
                <span>9</span>
                <span>10</span>
                <span>Next →</span>
            </div>
        </div>
    );
};

export default UserManagement;
