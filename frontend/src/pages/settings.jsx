import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './settings.css';
import logo from '../assets/logo.png';
import settings from '../assets/settings.png';

const Settings = () => {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showHelpSupport, setShowHelpSupport] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleChangePasswordClick = () => {
        setShowChangePassword(true);
        setShowHelpSupport(false);
        setShowDeleteConfirmation(false);
    };

    const handleHelpSupportClick = () => {
        setShowHelpSupport(true);
        setShowChangePassword(false);
        setShowDeleteConfirmation(false);
    };

    const handleDeleteAccountClick = () => {
        setShowDeleteConfirmation(true);
        setShowChangePassword(false);
        setShowHelpSupport(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const isFormComplete = () => {
        return (
            formData.oldPassword.trim() !== '' &&
            formData.newPassword.trim() !== '' &&
            formData.confirmPassword.trim() !== '' &&
            formData.newPassword === formData.confirmPassword
        );
    };

    const handleSaveChanges = () => {
        alert('Password has been successfully set!');

            setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setShowChangePassword(false);
    };

    const handleDeleteAccount = () => {
        alert('Your account has been deleted!');
        navigate('/signin');
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };


    return (
        <div className='settings-container'>
            <Sidebar />
            <div className='settings-content'>
                <Navbar />
                <h1>Settings</h1>
                <div className='settings-box'>
                    <div className='settings-left'>
                    {!showChangePassword && !showHelpSupport && !showDeleteConfirmation && (
                        <>
                            <img src={settings} alt='settings' className='settings' />
                            <h2 className='settings-h1'>Tap one of the tabs to appear here</h2>
                        </>
                    )}
                        <div className='settings-tab'>
                            <img src={logo} alt='muk-logo' className='muklogo' />
                            <button 
                                className='change-password'
                                onClick={handleChangePasswordClick}>Change Password</button>
                            <button 
                            className='help-support'
                            onClick={handleHelpSupportClick}
                            >Help & Support</button>
                            <button 
                            className='delete-account'
                            onClick={handleDeleteAccountClick}
                            >Delete Account
                            </button>
                        </div>
                    </div>
                    {showChangePassword && (
                        <div className='settings-right'>
                        <label>
                            Old Password
                            <input 
                            type='password'
                            name='oldPassword'
                            placeholder='Enter Your Old Password'
                            className='old-password'
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            minLength={8}
                            />
                        </label>
                        <label className='newpassword'>
                            New Password
                            <input 
                            type='password'
                            name='newPassword'
                            value={formData.newPassword}
                            placeholder='Enter Your New Password'
                            className='new-password'
                            onChange={handleInputChange}
                            minLength={8}/>
                        </label>
                        <label className='confirmpassword'>
                            Confirm Password
                            <input 
                            type='password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            placeholder='Confirm Your New Password'
                            className='confirm-password'
                            onChange={handleInputChange}
                            minLength={8}/>
                        </label>
                        <button 
                            className='save-changes'
                            disabled={!isFormComplete()}
                            onClick={handleSaveChanges}
                        >Save Changes
                        </button>
                    </div>
                )}
                {showHelpSupport && (
                    <div className='settingsright'>
                        <h2>Help & Support</h2>
                        <p className='p'>Kindly reach us via Email or Phone for any help.</p>
                        <h3 className='Email'>Email</h3>
                        <h4 className='email-contact'>Send us an email on;<br /><b>alvin69david@gmail.com</b></h4>
                        <h5 className='Email'>Phone</h5>
                        <h6 className='email-contact'>Give us a call on;<br/><b>MTN: 0772834567<br/>AIRTEL: 0758862363</b></h6>
                    </div>
                )}
                {showDeleteConfirmation && (
                    <div className='delete-confirmation'>
                        <h2>Are you sure your want to delete your account?</h2>
                        <div className='delete-buttons'>
                            <button
                                className='delete-no'
                                onClick={handleCancelDelete}
                            >No</button>
                            <button
                                className='delete-yes'
                                onClick={handleDeleteAccount}
                            >Yes
                            </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default Settings;