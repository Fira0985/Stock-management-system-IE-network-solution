import React, { useState } from 'react';
import './sidebar.css';
import {
    LayoutDashboard, Package, ShoppingCart, ShoppingBag,
    CreditCard, BarChart2, Truck, Users, User, Settings
} from 'lucide-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onToggle) {
            onToggle(newState); // ← send state to parent
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div className="brand">Track<span>እቃ</span><span>.</span></div>
                <button className="toggle-btn" onClick={handleToggle}>
                    {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>

            <ul className="menu">
                <li><LayoutDashboard size={16} /> {isOpen && 'Dashboard'}</li>
                <li><Package size={16} /> {isOpen && 'Products'}</li>
                <li><ShoppingCart size={16} /> {isOpen && 'Sales'}</li>
                <li><ShoppingBag size={16} /> {isOpen && 'Purchase'}</li>
                <li><CreditCard size={16} /> {isOpen && 'Credits'}</li>
                <li><BarChart2 size={16} /> {isOpen && 'Report'}</li>
                <li><Truck size={16} /> {isOpen && 'Supplier'}</li>
                <li><Users size={16} /> {isOpen && 'Customer'}</li>
                <li><User size={16} /> {isOpen && 'User'}</li>
                <li><Settings size={16} /> {isOpen && 'Settings'}</li>
            </ul>

            {isOpen && (
                <>
                    <div className="user-profile">
                        <div className="avatar" />
                        <div className="name">Samuel</div>
                    </div>
                    <button className="logout-btn">Logout</button>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
