import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfilePicture = () => {
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePic(reader.result); 
                localStorage.setItem('profilePic', reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Profile picture updated successfully!');
        navigate('/profile'); 
    };

    return (
        <div classname="edit-profile-picture-container">
            <h1 className="edit-profile-picture-h1">Edit Profile Picture</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload Profile Picture:
                    <input
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <br />
                {profilePic && (
                    <div className="profile-picture-preview">
                        <h3>Preview:</h3>
                        <img
                            src={profilePic}
                            alt="Profile Preview"
    
                        />
                    </div>
                )}
                <br />
                <button type="submit">
                    Save
                </button>
            </form>
        </div>
    );
};

export default EditProfilePicture;