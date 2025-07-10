import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { getUserByEmail, editUser, uploadProfileImage } from '../../services/userService';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

const UserProfile = (props) => {
    const [username, setUserName] = useState(localStorage.getItem('userName'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showUserProfile, setShowUserProfile] = useState(false);

    const profileImage = `http://localhost:3000/${imageUrl}`;

    function sendToParent(data) {
        props.onSendToParent(data);
    }

    async function fetchData() {
        const result = await getUserByEmail(email);
        setPhone(result.phone);
        setImageUrl(result.image_url);
    }

    async function updateData() {
        const data = { username, phone, email };
        try {
            await editUser(data);
            localStorage.setItem('userName', username);
            sendToParent(false);
        } catch (error) {
            console.error('Update Failed:', error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const result = await uploadProfileImage(file);
                setImageUrl(result.user.image_url);
            } catch (err) {
                console.error('Image upload failed:', err.message);
            }
        }
    };

    const closeProfilePopup = (e) => {
        setShowUserProfile(false);
        e.stopPropagation()
        sendToParent(false);
    };

    return (
        <section className="profile-card">
            <button className="modal-closes" onClick={closeProfilePopup}>
                &times;
            </button>
            <div className="profile-image-section">
                <label htmlFor="imageUpload" className="image-upload-label">
                    {imageUrl ? (
                        <img src={profileImage} alt="Profile" className="profile-avatar" />
                    ) : (
                        <div className="profile-placeholder">
                            <FiUser size={64} />
                        </div>
                    )}
                    <div className="change-photo-overlay">Change Photo</div>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </label>
            </div>

            <div className="profile-info-section">
                <div className="input-group">
                    <FiUser className="input-icon" />
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <label htmlFor="username">Username</label>
                </div>

                <div className="input-group">
                    <FiMail className="input-icon" />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="input-group">
                    <FiPhone className="input-icon" />
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <label htmlFor="phone">Phone</label>
                </div>

                <div className="input-group">
                    <FiLock className="input-icon" />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="save-button" onClick={updateData}>
                    Save Changes
                </button>
            </div>
        </section>
    );
};

export default UserProfile;
