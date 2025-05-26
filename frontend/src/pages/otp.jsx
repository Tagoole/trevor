import React, { useState, useRef } from 'react';
import './Otp.css';
import shield from '../assets/shield.png';
import refresh from '../assets/refresh.png';
import help from '../assets/help.png';
import Congratulations from './congratulations';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api'; // Import authAPI from services

const Otp = ({ email, onResendOtp }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleVerifyClick = async () => {
        const enteredOtp = otp.join('');

        if (!enteredOtp) {
            setError('Please enter the OTP.');
            return;
        }

        try {
            setIsVerifying(true);
            setError('');
            
            // Call the API to verify OTP
            await authAPI.verifyOTP(email, enteredOtp);
            
            setSuccess(true);
            console.log('OTP verified successfully');
            setShowCongratulations(true);
            navigate('/congs'); // Redirect to congratulations page
        } catch (err) {
            console.error('OTP verification failed:', err);
            setError(typeof err === 'string' ? err : 'Invalid OTP. Please try again.');
            setSuccess(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendClick = async () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        setSuccess(false);

        try {
            if (onResendOtp) {
                await onResendOtp();
            } else {
                // Fallback if onResendOtp is not provided
                await authAPI.resendOTP(email);
                alert('OTP resent successfully to your email');
            }
        } catch (err) {
            console.error('Failed to resend OTP:', err);
            setError('Failed to resend OTP. Please try again.');
        }
    };

    const handleKeyDown = (e, index) => {
        // Allow focusing previous input when backspace is pressed on empty input
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    if (showCongratulations) {
        return <Congratulations />;
    }

    return (
        <div className='otp-container'>
            <div className='aits-logo'>AITS</div>
            <div className='help'>
                <img src={help} alt='help logo' className='help-logo' />Help?
                <div className='tooltip'>
                    Email Address: alvin69david@gmail.com
                    Phone Number: 0758862363
                </div>
            </div>
            <div className='otp-content'>
                <img className='shield' src={shield} alt='shield logo' />
                <h2 className='authenticate-title'>Authenticate Your Account</h2>
                <p className='authenticate-sub-title'>
                    Protecting your account is our top priority. Please confirm your account by entering the authorization code we sent to <strong>{email}</strong>.
                </p>
                <div className='otp-inputs'>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            className='otp-input'
                            type='text'
                            maxLength='1'
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
                <button
                    className='verify-button'
                    onClick={handleVerifyClick}
                    disabled={!isOtpComplete || isVerifying}>
                    {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
                <button
                    className='resend-button'
                    onClick={handleResendClick}>
                    <img className='refresh-icon' src={refresh} alt='refresh icon' />
                    Resend Code
                </button>
            </div>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>OTP verified successfully!</p>}
        </div>
    );
};

export default Otp;