import React, { useState } from 'react';
import './signup.css';
import Otp from './otp';
import logo from '../assets/logo.png';
import person from '../assets/person.png';
import mail from '../assets/mail.png';
import padlock from '../assets/padlock.png';
import { authAPI } from '../services/api'; 

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: '',
        termsAccepted: false,
    });

    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError(null);
            
            
            await authAPI.signup(
                formData.email, 
                formData.fullName, 
                formData.password, 
                formData.role
            );
            
            
            localStorage.setItem('userEmail', formData.email);
            
            
            setShowOtpScreen(true);
        } catch (err) {
            console.error('Signup failed:', err);
            setError(typeof err === 'string' ? err : 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await authAPI.resendOTP(formData.email);
            alert('OTP has been resent to your email');
        } catch (err) {
            alert('Failed to resend OTP. Please try again.');
        }
    };

    if (showOtpScreen) {
        return <Otp email={formData.email} onResendOtp={handleResendOtp} />;
    }

    return (
        <div className='signup-container'>
            <div className='signup-left'>
                <img className='muk' src={logo} alt='muk logo' />
                <h1 className='system-title'>Welcome to the<br /> Academic Issue Tracking System<br /> AITS</h1>
            </div>
            <div className='signup-right'>
                <form className='signup-right-form' onSubmit={handleSubmit}>
                    <h2 className='title'>Create An Account</h2>
                    <p className='sub-title'>Please fill in all the fields below</p>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <label>
                        Full Name
                        <div className='input-container'>
                            <input
                                className='full-name'
                                type='text'
                                name='fullName'
                                placeholder='Enter your Full Name'
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <img src={person} alt='person' className='person-icon' />
                        </div>
                    </label>
                    <label>
                        Email Address
                        <div className='input-container'>
                            <input
                                className='email-address'
                                type='email'
                                name='email'
                                placeholder='Enter your Email Address'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <img src={mail} alt='mail' className='mailicon' />
                        </div>
                    </label>
                    <label>
                        Password
                        <div className='input-container'>
                            <input
                                className='password'
                                type='password'
                                name='password'
                                placeholder='Enter your Password (min - 8 characters)'
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                            <img src={padlock} alt='padlock' className='padlockicon' />
                        </div>
                    </label>
                    <label>
                        Role
                        <div className='dropdown'>
                            <select
                                className='role-select'
                                name='role'
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Select Role</option>
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="registrar">Registrar</option>
                            </select>
                        </div>
                    </label>
                    <label className='terms'>
                        <input
                            type='checkbox'
                            className='terms-checkbox'
                            name='termsAccepted'
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            required
                        />
                        I have read and accepted all the AITS terms and conditions.
                    </label>
                    <button
                        className='signup-button'
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'PROCESSING...' : 'SIGN UP'}
                    </button>
                    <p className='signin-text'>
                        Already have an account? <a href='signin' className='signin-link'>Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;