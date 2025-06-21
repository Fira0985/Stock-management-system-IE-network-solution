import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { getUserByEmail, editUser, uploadProfileImage } from '../../services/userService';
import { FiUser } from 'react-icons/fi';


const UserProfile = (props) => {

    const [username, setUserName] = useState(localStorage.getItem('userName'))
    const [email, setEmail] = useState(localStorage.getItem('email'))
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const profileImage = `http://localhost:3000/${imageUrl}`

    function sendToParent(data) {
        props.onSendToParent(data)
    }

    async function fetchData(params) {
        const result = await getUserByEmail(email)
        setPhone(result.phone)
        setImageUrl(result.image_url)

    }

    async function updateData() {
        const data = {
            username: username,
            phone: phone,
            email: email
        }
        try {
            const result = await editUser(data)
            localStorage.setItem('userName', username)
            sendToParent(false)
        } catch (error) {
            console.error('Update Failed:', err.message);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const result = await uploadProfileImage(file);

                console.log("Upload result:", result);

                setImageUrl(result.user.image_url);

                console.log("Final image URL:", imageUrl);
            } catch (err) {
                console.error('Image upload failed:', err.message);
            }
        }
    };

    return (
        <div className="profile-modern-card">
            <div className="profile-image-wrapper">
                <label htmlFor="imageUpload">
                    {imageUrl ? <img
                        src={profileImage}
                        alt="Profile"
                        className="profile-avatar"
                    /> : <span className="profile-icon"><FiUser /></span>}
                    <div className="change-photo-text">Change</div>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </label>
            </div>

            <div className="form-field">
                <input
                    type="text"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label>Username</label>
            </div>

            <div className="form-field">
                <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
            </div>

            <div className="form-field">
                <input
                    type="text"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <label>Phone</label>
            </div>

            <div className="form-field">
                <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
            </div>

            <button className="save-button" onClick={updateData}>Save Changes</button>
        </div>
    );
};

export default UserProfile;
