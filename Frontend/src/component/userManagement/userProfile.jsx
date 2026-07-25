import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { getUserByEmail, editUser, uploadProfileImage, changePassword } from '../../services/userService';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = (props) => {
    const { user } = useAuth();
    const storedUserInfo = (() => {
        try {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
        } catch {
            return {};
        }
    })();

    const [username, setUserName] = useState(
        storedUserInfo.username || user?.username || user?.name || localStorage.getItem('userName') || localStorage.getItem('username') || ''
    );
    const [email, setEmail] = useState(
        storedUserInfo.email || user?.email || localStorage.getItem('email') || ''
    );
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
        : 'http://localhost:3000';
    const profileImage = imageUrl ? `${apiBaseUrl}/${imageUrl.replace(/^\//, '')}` : '';

    function sendToParent(data) {
        props.onSendToParent(data);
    }

    async function fetchData() {
        if (!email) {
            return;
        }

        try {
            const result = await getUserByEmail(email);
            setUserName(result.username || result.name || username || '');
            setEmail(result.email || email);
            setPhone(result.phone || '');
            setImageUrl(result.image_url || '');
        } catch (error) {
            console.error('Failed to load user profile:', error);
            toast.error('Failed to load profile information');
        }
    }

    async function updateData() {
        const data = { username, phone, email };
        try {
            await editUser(data);
            localStorage.setItem('userName', username);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);

            const stored = localStorage.getItem('userInfo');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.username = username;
                parsed.name = username;
                parsed.email = email;
                localStorage.setItem('userInfo', JSON.stringify(parsed));
            }

            toast.success('Profile updated successfully');
            window.dispatchEvent(new CustomEvent('profileClosed'));
        } catch (error) {
            console.error('Update Failed:', error?.message || error);
            toast.error('Profile update failed');
        }

        // Change password if field is not empty
        if (password.trim()) {
            try {
                await changePassword({ email, password });
                setPassword('');
                toast.success('Password changed successfully');
            } catch (err) {
                console.error('Password change failed:', err?.message || err);
                toast.error('Password change failed');
            }
        }

        sendToParent(false);
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
                toast.success('Profile image updated');
            } catch (err) {
                console.error('Image upload failed:', err.message);
                toast.error('Image upload failed');
            }
        }
    };

    const closeProfilePopup = (e) => {
        e.stopPropagation();
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
                        placeholder="Leave blank to keep current password"
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="save-button" onClick={updateData}>
                    Save Changes
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </section>
    );
};

export default UserProfile;
