import React, { useState } from 'react';
import './signin.css';
import logo from '../assets/logo.png';
import mail from '../assets/mail.png';
import padlock from '../assets/padlock.png';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api'; // Update this path to where your api.jsx file is located

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    // const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const passwordLength = 8;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        setIsTermsAccepted(e.target.checked);
    };

    const handleSignInClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (formData.password.length < passwordLength) {
            setError(`Password must be at least ${passwordLength} characters long.`);
            setLoading(false);
            return;
        }

        try {
            // Call the signin API endpoint
            const response = await authAPI.signin(formData.email, formData.password);
            
            // Get user role from the response or from another API call if needed
            const userRole = response.role || 'student'; // Default to student if no role provided
            
            // Store user data in localStorage
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userEmail', formData.email);
            
            // Redirect to the appropriate dashboard based on the user's role
            const dashboardPaths = {
                registrar: '/registrar-dashboard/dashboard',
                lecturer: '/lecturer/dashboard',
                student: '/app/dashboard',
            };

            navigate(dashboardPaths[userRole] || '/');
        } catch (err) {
            // Handle API errors
            setError(err.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // const isFormValid = formData.email && formData.password.length >= passwordLength && isTermsAccepted;
    const isFormValid = formData.email && formData.password.length >= passwordLength;

    return (
        <div className='signin-container'>
            <div className='signin-left'>
                <img src={logo} alt='logo' className='muk' />
                <h1 className='system-title'>Welcome to the<br /> Academic Issue Tracking System<br />AITS</h1>
            </div>
            <div className='signin-right'>
                <form className='signin-right-form' onSubmit={handleSignInClick}>
                    <h2 className='title'>Sign In Into Your Account</h2>
                    <p className='sub-title'>Please fill in all the fields below</p>
                    <label>
                        Email Address
                        <div className='input-container'>
                            <input
                                className='emailaddress'
                                type='email'
                                name='email'
                                placeholder='Enter Your Email Address'
                                value={formData.email}
                                onChange={handleChange} />
                            <img src={mail} alt='mail logo' className='input-icon' />
                        </div>
                    </label>
                    <label>
                        Password
                        <div className='input-container'>
                            <input
                                className='pass-word'
                                type='password'
                                name='password'
                                placeholder='Enter Your Password'
                                value={formData.password}
                                onChange={handleChange}
                                minLength={passwordLength} />
                            <img src={padlock} alt='padlock' className='padlock-icon' />
                        </div>
                    </label>
                    <p className='forgot-password'>
                        <Link to="/emailrequest" className='forgot-password-link'>Forgot Password?</Link>
                    </p>
                    {/* <label className='aits-terms'>
                        <input
                            type='checkbox'
                            className='termscheckbox'
                            checked={isTermsAccepted}
                            onChange={handleCheckboxChange} />
                        I have read and accepted all the AITS terms and conditions
                    </label> */}
                    <button
                        className='signinbutton'
                        disabled={!isFormValid || loading}>
                        {loading ? 'Signing In...' : 'SIGN IN'}
                    </button>
                    {error && <p className='error-message'>{error}</p>}
                    <p className='link'>Don't have an account? <Link to='/signup' className='signup-link'>Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;