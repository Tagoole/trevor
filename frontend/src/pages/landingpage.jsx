import React from 'react';
import './landingpage.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const navigate = useNavigate();

    function handlenextroute() {
        navigate("/signup");
    };

    const move = useNavigate();

    function handlesignin() {
    move("/signin");
    
    };
    
    return (
            <div className='landing-page'>
                <div className='logo-container'>
                    <img src={logo} className='muk-logo' alt='muk' />
                    <span className='logo-text' >AITS</span>
                </div>
                <div className='auth-buttons'>
                    <button className='auth-button' onClick={handlenextroute} >SIGN UP</button>
                    <div className='separator' ></div>
                    <button className='auth-button' onClick={handlesignin}>SIGN IN</button>
                </div>
                <p className='auth-text'>"Please Sign Up to get started"</p>
                <div className='landing-text'>
                    <h1 className='body-words'>ACADEMIC ISSUE TRACKING SYSTEM</h1>
                    <p className='sub-text' >"Track and manage your issues seamlessly"</p>
                </div>
            </div>
    );
};

export default LandingPage;