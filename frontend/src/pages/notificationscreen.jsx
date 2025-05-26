import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './notificationscreen.css';
import emptybox from '../assets/emptybox.png';
import backarrow from '../assets/backarrow.png';
import Navbar from '../components/Navbar';
import { IssuesContext } from '../context/IssueContext';

const NotificationScreen = () => {
    const navigate = useNavigate();
    const { notificationMessage } = useContext(IssuesContext);

    const handleBackClick = () => {
        navigate('/app/dashboard');
    };

    return (
        <div>
            <Navbar />
            <div className='notification-screen'>
                <img src={backarrow} alt="backarrow" className='notification-backarrow-icon' onClick={handleBackClick} />
                <h1></h1>
                {notificationMessage && notificationMessage.message ? (
                    <div className='notification-container'>
                        <p>{notificationMessage.message}</p>
                        <span className='notification-date'>
                            {notificationMessage.date} {notificationMessage.time}
                        </span>
                    </div>
                ) : (
               <>
                    <img src={emptybox} alt="emptybox"  className='notification-emptybox'/>
                    <p>There are no notifications here. You will get notified when you get a notification which will appear here.</p>
                </>
                )}
            </div>
        </div>
    );
};

export default NotificationScreen;