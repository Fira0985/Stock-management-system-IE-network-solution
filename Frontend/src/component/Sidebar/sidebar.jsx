import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import {
    LayoutDashboard, Package, ShoppingCart, ShoppingBag,
    CreditCard, BarChart2, Truck, Users, User, Settings
} from 'lucide-react';
import { FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';
import { uploadProfileImage } from '../../services/userService';  // Make sure this path is correct

const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [storedName, setStoredName] = useState('');
    // const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef();

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (props.onToggle) {
            props.onToggle(newState);
        }
    };

    // Load name and avatar from localStorage on mount
    useEffect(() => {
        const nameFromStorage = localStorage.getItem('userName');
        // const avatarFromStorage = localStorage.getItem('userAvatar');
        if (nameFromStorage) {
            setStoredName(nameFromStorage);
        }
        // if (avatarFromStorage) {
        //     setAvatar(avatarFromStorage);
        // }
    }, []);

    // Trigger file input when avatar clicked
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    // Handle profile image file selection and upload
    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file && file.type.startsWith('image/')) {
    //         try {
    //             const result = await uploadProfileImage(file);
    //             // Assuming result.user.image_url contains relative path
    //             const imageUrl = `http://localhost:3000/${result.user.image_url}`;
    //             setAvatar(imageUrl);
    //             localStorage.setItem('userAvatar', imageUrl);
    //         } catch (err) {
    //             console.error('Image upload failed:', err.message);
    //         }
    //     }
    // };

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
                    <div className="user-profile" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                        {/* <div className="avatar">
                            {avatar ? (
                                <img src={avatar} alt="User Avatar" className="avatar-img" />
                            ) : (
                                <FiUser size={24} />
                            )}
                        </div> */}
                        {/* <div className="name">{storedName}</div> */}
                    </div>
                    <button className="logout-btn">Logout</button>
                </>
            ) : (
                <>
                    <div className='user-profile-collapse' onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                        {/* <div className="avatar">
                            {avatar ? (
                                <img src={avatar} alt="User Avatar" className="avatar-img" />
                            ) : (
                                <FiUser size={24} />
                            )}
                        </div> */}
                    </div>
                    <button className="logout-btn-collopse">Logout</button>
                </>
            )}

            {/* <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            /> */}
        </aside>
    );
};

export default Sidebar;
