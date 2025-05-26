import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import backarrow from '../assets/backarrow.png';
import './helpsupport.css';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/app/dashboard');
    };

    return (
        <div className='helpsupport-container'>
            <Sidebar />
            <div className='helpsupport-content'>
                <Navbar />
                <img 
                    src={backarrow} 
                    alt="backarrow" 
                    className='help-backarrow-icon' 
                    onClick={handleBackClick}/>
                <h1>Help/Support</h1>
                <div className='helpsupport-box'>
                    <h2>Kindly reach us via Email or Phone<br /> for any help </h2>
                    <p>Email</p>
                    <h3>Send us an email on; <br />alvin69david@gmail.com</h3>
                    <p className='phone-contacts'>Phone Contacts</p>
                    <h4>Give us a call on;<br /><b>AIRTEL:</b> 07588862363<br />Or<br /><b>MTN:</b> 0784566784</h4>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;