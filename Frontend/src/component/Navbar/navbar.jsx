import React, { useEffect, useRef, useState } from 'react';
import { FiBell, FiSun } from 'react-icons/fi';
import './Navbar.css';
import { FiUser } from 'react-icons/fi';


const Navbar = ({ isSidebarOpen }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef();

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedName) setName(storedName);
        if (storedAvatar) setAvatar(storedAvatar);
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current.click(); // Trigger file selection
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setAvatar(base64Image);
                localStorage.setItem('userAvatar', base64Image); // Persist image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <header className={isSidebarOpen ? "topbar" : "topbar-collapsed"}>
            <div className="title">Dashboard</div>
            <div className="topbar-right">
                <span className="icon"><FiBell /></span>
                <span className="icon"><FiSun /></span>

                <div className="avatar small" onClick={handleAvatarClick}>
                    {avatar ? (
                        <img src={avatar} alt="User Avatar" className="avatar-img" />
                    ) : (
                        <span className="default-avatar"><FiUser size={18} /></span>
                    )}
                </div>

                {name && <span className="username">{name}</span>}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>
        </header>
    );
};

export default Navbar;
