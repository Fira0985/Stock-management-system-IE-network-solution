import React, { useEffect, useState } from 'react';
import './sidebar.css';
import {
    LayoutDashboard, Package, ShoppingCart, ShoppingBag,
    CreditCard, BarChart2, Truck, Users, User, Settings
} from 'lucide-react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [storedName, setStoredName] = useState('');

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (props.onToggle) {
            props.onToggle(newState);
        }
    };

    // Load name from localStorage on mount
    useEffect(() => {
        const nameFromStorage = localStorage.getItem('userName');
        if (nameFromStorage) {
            setStoredName(nameFromStorage);
        }
    }, []);

    const menuItems = [
        { icon: <LayoutDashboard size={16} />, label: "Dashboard" },
        { icon: <Package size={16} />, label: "Products" },
        { icon: <ShoppingCart size={16} />, label: "Sales" },
        { icon: <ShoppingBag size={16} />, label: "Purchase" },
        { icon: <CreditCard size={16} />, label: "Credits" },
        { icon: <BarChart2 size={16} />, label: "Report" },
        { icon: <Truck size={16} />, label: "Supplier" },
        { icon: <Users size={16} />, label: "Customer" },
        { icon: <User size={16} />, label: "User" },
        { icon: <Settings size={16} />, label: "Settings" },
    ];

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                {isOpen ? <div className="brand">Sto<span>ck</span><span>.</span></div> : <div></div>}
                <button className="toggle-btn" onClick={handleToggle}>
                    {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>

            <ul className="menu">
                {menuItems.map((item) => (
                    <li key={item.label} onClick={() => props.onMenuSelect(item.label)}>
                        {item.icon} {isOpen && item.label}
                    </li>
                ))}
            </ul>

            {isOpen ? (
                <>
                    <div className="user-profile">
                        <div className="avatar" />
                        <div className="name">{storedName}</div>
                    </div>
                    <button className="logout-btn">Logout</button>
                </>
            ) : (
                <>
                    <div className='user-profile-collapse'>
                        <div className="avatar" />
                    </div>
                    <button className="logout-btn-collopse">Logout</button>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
