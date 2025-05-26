import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './emailrequest.css';
import help from '../assets/help.png';
import mail from '../assets/mail.png';
import doorkey from '../assets/doorkey.png';
import { authAPI } from '../services/api';
import ForgotPassword from './forgotpassword';

const EmailRequest = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showNextScreen, setShowNextScreen] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNextClick = async () => {
        setIsLoading(true);
        try {
            await authAPI.forgotPassword(email);
            // navigate('/forgotpassword');
            setError(null);
            setShowNextScreen(true);
        } catch (error) {
            setError(typeof error === 'string' ? error : 'An error occured, please try again.');
        }
        setIsLoading(false);
    };
    
    if (showNextScreen) {
        return <ForgotPassword email={email} onResendOtp={handleNextClick} />;
    }

    return (
        <div className='emailrequest-container'>
            <h1>AITS</h1>
            <div className='emailrequest-help'>
                <img src={help} alt='help logo' className='emailrequest-help-logo' />Help?
                <div className='tooltip'>
                    Email Address: alvin69david@gmail.com
                    Phone Number: 0758862363
                </div>
            </div>
            <div className='emailrequest-content'>
                <img src={doorkey} alt='door' className='emailrequest-door' />
                <h1>Reset Password</h1>
                <p>Don't worry! Enter your registered Email Address<br />to reset your password.</p>
                    <input 
                        type='email'
                        name='email'
                        className='emailrequest-email' 
                        placeholder='Enter Your Email Address'
                        value={email}
                        onChange={handleEmailChange}
                        required />
                    <img src={mail} alt='mailicons' className='emailrequest-mail' /> 
                    {error && <div className="error-message">{error}</div>}   
                    <button 
                        className='emailrequest-nextbutton'
                        disabled={!email.trim()}
                        onClick={handleNextClick}
                    >{isLoading ? "Requesting..." :  "Next"}
                    </button>
                    <Link to="/signin" className='emailrequest-signin-link'>
                        Sign In
                    </Link>
            </div>
        </div>
        
    );
};

export default EmailRequest;