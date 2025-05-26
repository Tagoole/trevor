import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './profile.css';
import edit from '../assets/edit.png';

const Profile = () => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);

    const [user, setUser] = useState({
        address: localStorage.getItem('address') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || '',
        gender: localStorage.getItem('gender') || '',
        registrationNumber: localStorage.getItem('registrationNumber') || '',
        studentNumber: localStorage.getItem('studentNumber') || '',
        course: localStorage.getItem('course') || '',
        semester: localStorage.getItem('semester') || '',
    });

    const getInitials = (name) => {
        if (!name) return 'N/A';
        return name.charAt(0).toUpperCase();
    };

    useEffect(() => {
        
        const savedProfilePic = localStorage.getItem('profilePic');
        if (savedProfilePic) {
            setProfilePic(savedProfilePic);
        }
    }, []);

    return (
        <div className='profile-container'>
            <Sidebar />
            <div className='profile-content'>
                <Navbar />
                <h1>Profile</h1>
                <div className='profile-section'></div>
                <div className='profile'>
                    <div className="profile-picture-container">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="profile-picture"
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                            />
                        ) : (
                            <div className="profile-initials">
                                {getInitials(user.fullName)}
                            </div>
                        )}
                    </div>
                    <button
                        className='editbutton'
                        onClick={() => navigate('/app/editprofilepicture')}
                    >
                        Edit
                        <img src={edit} alt='edit' className='edit' />
                    </button>
                </div>
                <div className='personal-information'>
                    <h1>Personal Information</h1>
                    <label className='address'>Email Address:</label>
                    <h2 className='address'>{user.address}</h2>
                    <label className='phone'>Phone Number:</label>
                    <h2 className='phone-number'>{user.phoneNumber}</h2>
                    <label className='gender'>Gender:</label>
                    <h2>{user.gender}</h2>
                    <button
                        className='personal-information-editbutton'
                        onClick={() => navigate('/app/editpersonalinfo')}
                    >
                        Edit
                        <img src={edit} alt='edit' className='edit' />
                    </button>
                </div>
                <div className='academic-information'>
                    <h1>Academic Information</h1>
                    <label className='registration'>Registration Number:</label>
                    <h2 className='registration-number'>{user.registrationNumber}</h2>
                    <label className='student'>Student Number:</label>
                    <h2 className='student-number'>{user.studentNumber}</h2>
                    <label className='course'>Course:</label>
                    <h2 className='course-name'>{user.course}</h2>
                    <label className='semester'>Semester:</label>
                    <h2 className='semester-name'>{user.semester}</h2>
                    <button
                        className='academic-information-editbutton'
                        onClick={() => navigate('/app/editacademicinfo')}
                    >
                        Edit
                        <img src={edit} alt='edit' className='edit' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;