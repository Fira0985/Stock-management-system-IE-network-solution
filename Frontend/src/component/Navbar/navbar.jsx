import React from 'react';
import { FiBell } from 'react-icons/fi';
import { FiSun } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ isSidebarOpen }) => {
    return (
        <header className={isSidebarOpen? "topbar" : "topbar-collapsed"}>
            <div className="title">Dashboard</div>
            <div className="topbar-right">
                <span className="icon"><FiBell /></span>
                <span className="icon"><FiSun /></span>
                <div className="avatar small" />
                <span>Samuel</span>
            </div>
        </header>
    );
};

export default Navbar;
