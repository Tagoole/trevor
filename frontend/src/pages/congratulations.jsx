import React from 'react';
import './congratulations.css';
import congratulations from '../assets/congratulations.png';
import help from '../assets/help.png';
import { Link } from 'react-router-dom';


const Congratulations = () => {
    console.log('Congratulations component rendered');
    return (
        <div className='congratulations-container'>
            <div className='aits-logo'>AITS</div>
            <div className='help'>
                <img src={help} alt='help logo' className='help-logo' />Help?
                <div className='tooltip'>
                    Email Address: alvin69david@gmail.com
                    Phone Number: 0758862363
                </div>
            </div>
            <div className='congratulations-content'>
                <img className='congratulations-logo'src={congratulations} alt='congratulations logo' />
                <h1>Congratulations!</h1>
                <p>Your account has been successfully created and verified.<br/>Sign In to access your account.</p>
               <Link to="/signin">
               <button 
                className='signin-button' >
                SIGN IN
               </button>
               </Link>
            </div>
        </div>
    );
};

export default Congratulations;