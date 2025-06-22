import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import {
    LayoutDashboard, Package, ShoppingCart, ShoppingBag,
    CreditCard, BarChart2, Truck, Users, User, Settings
} from 'lucide-react';
import { FiChevronLeft, FiChevronRight, FiPhoneCall, FiLogOut } from 'react-icons/fi';
import { uploadProfileImage } from '../../services/userService';

const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phone: '',
        id: '',
        role: '',
    });

    const role = localStorage.getItem('role');

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (props.onToggle) {
            props.onToggle(newState);
        }
    };

    useEffect(() => {
        setUserInfo({
            username: localStorage.getItem('userName') || '',
            email: localStorage.getItem('email') || '',
            phone: localStorage.getItem('phone') || '',
            id: localStorage.getItem('id') || '',
            role: localStorage.getItem('role') || '',
        });
    }, []);

    const allMenuItems = [
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

    const filteredMenuItems = allMenuItems.filter((item) => {
        if (role === 'CLERK') {
            const restrictedLabels = ['User', 'Supplier', 'Report', 'Purchase'];
            return !restrictedLabels.includes(item.label);
        }
        return true;
    });

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div className="brand">
                    {isOpen ? (
                        <>Track<span>እቃ</span><span>.</span></>
                    ) : (
                        <>T.</>
                    )}
                </div>
                <button className="toggle-btn" onClick={handleToggle}>
                    {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>

            {/* User Info Box for CLERK */}
            {role === 'CLERK' && (
                isOpen ? (
                    <div className="user-info-box">
                        <h4 className="user-info-header">Your Profile</h4>
                        <div className="user-info-field"><strong>ID:</strong> {userInfo.id}</div>
                        <div className="user-info-field"><strong>Name:</strong> {userInfo.username}</div>
                        <div className="user-info-field"><strong>Email:</strong> {userInfo.email}</div>
                        <div className="user-info-field"><strong>Phone:</strong> {userInfo.phone}</div>
                        <div className="user-info-field"><strong>Role:</strong> {userInfo.role}</div>
                    </div>
                ) : (
                    <div
                        className="user-info-icon"
                        title={`ID: ${userInfo.id}\nName: ${userInfo.username}\nEmail: ${userInfo.email}\nPhone: ${userInfo.phone}\nRole: ${userInfo.role}`}
                    >
                        <User size={22} />
                    </div>
                )
            )}

            <ul className="menu">
                {filteredMenuItems.map((item) => (
                    <li key={item.label} onClick={() => props.onMenuSelect(item.label)}>
                        {item.icon} {isOpen && item.label}
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                {isOpen ? (
                    <>
                        <div className="user-profile">
                            <ul className="sidebar-contact-list">
                                <li className="contact-item" onClick={() => props.onMenuSelect('Contact')}>
                                    <FiPhoneCall size={16} className="contact-icon" />
                                    <span className="contact-label">Contact</span>
                                </li>
                            </ul>
                        </div>
                        <button className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <div className="user-profile-collapse">
                            <ul className="sidebar-contact-list">
                                <li className="contact-item" onClick={() => props.onMenuSelect('Contact')} title="Contact">
                                    <FiPhoneCall size={20} className="contact-icon" />
                                </li>
                            </ul>
                        </div>
                        <button className="logout-btn-collopse" title="Logout">
                            <FiLogOut size={18} />
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
