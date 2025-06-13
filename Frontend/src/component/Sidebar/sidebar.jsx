import React from 'react';
import './sidebar.css';
import { LayoutDashboard, Package, ShoppingCart, ShoppingBag, CreditCard, BarChart2, Truck, Users, User, Settings } from 'lucide-react';


const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="brand">Track<span>እቃ</span> <span>.</span></div>
            <ul className="menu">
                <li><LayoutDashboard size={16} /> Dashboard</li>
                <li><Package size={16} /> Products</li>
                <li><ShoppingCart size={16} /> Sales</li>
                <li><ShoppingBag size={16} /> Purchase</li>
                <li><CreditCard size={16} /> Credits</li>
                <li><BarChart2 size={16} /> Report</li>
                <li><Truck size={16} /> Supplier</li>
                <li><Users size={16} /> Customer</li>
                <li><User size={16} /> User</li>
                <li><Settings size={16} /> Settings</li>
            </ul>

            <div className="user-profile">
                <div className="avatar" />
                <div className='name'>Samuel</div>
            </div>
            <button className="logout-btn">Logout</button>
        </aside>
    );
};

export default Sidebar;
