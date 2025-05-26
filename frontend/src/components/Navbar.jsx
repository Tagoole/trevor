import React, { useState , useEffect, useContext } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import search from '../assets/search.png';
import notification from '../assets/notification.png';
import mail from '../assets/mail.png';
import { useNavigate } from 'react-router-dom';
import { IssuesContext } from '../context/IssueContext';

const Navbar = (/*{ badgeCount, setBadgeCount }*/) => {
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();
    const { badgeCount, setBadgeCount, issues } = useContext(IssuesContext);

    const [user, setUser] = useState({
        fullName: '',
        profilePic: null,
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
    const userFullName = localStorage.getItem('userFullName') || 'Guest User';
        setUser((prevUser) => ({
            ...prevUser,
            fullName: userFullName,
        }));
        const savedProfilePic = localStorage.getItem('profilePic');
        if (savedProfilePic) {
            setProfilePic(savedProfilePic);
            };
        }
    , []);

    const getInitials = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    };

    const handleNotificationClick = () => {
        const userRole = localStorage.getItem('userRole');
        const basePath = userRole === 'registrar' ? '/registrar-dashboard' : '/app';
        navigate(`${basePath}/notifications`);

        setBadgeCount(0);

        if (userRole === 'registrar') {
            setBadgeCount(0);
        }
    };

    const handleMailClick = () => {
        const userRole = localStorage.getItem('userRole');
        const basePath = userRole === 'registrar' ? '/registrar-dashboard' : '/app';
        navigate(`${basePath}/messages`);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
        } else {
            const filteredResults = issues.filter((issue) =>
                issue.title.toLowerCase().includes(query.toLowerCase()) ||
                issue.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate('/search', { state: { query: searchQuery, results: searchResults } });
    };

    return (
            <nav className='navbar'>
                <div className='navbar-logo'>
                    <img 
                    src={logo} alt='muk-logo' 
                    className='makerere-logo' />
                    <span className='navbar-logo-text'>Academic Issue Tracking System</span>
                    </div>
                    <div className='search-container'>
                        <form onSubmit={handleSearchSubmit} className='search-form'>
                            <input
                            type='text'
                            className='search-input'
                            placeholder='Search for anything...'
                            onChange={handleSearchChange}
                            value={searchQuery}
                            />
                            <img src={search} alt='search' className='search-icon' />
                    </form>
                    </div>
                    <div className='notifications-container'>
                        <img 
                            src={notification} 
                            alt='notification' 
                            className='notification-icon' 
                            onClick={handleNotificationClick}
                        />
                        {badgeCount > 0 && (
                            <span className='notification-badge'></span>)}
                    </div>
                    <img 
                        src={mail} 
                        alt='mail' 
                        className='mail-icon'
                        onClick={handleMailClick}
                    />
                        {user.profilePic ? (
                            <img 
                               src={profilePic} 
                               alt='Profile' 
                               className='navbar-profile-picture' />
                        ) : (
                            <div className='user-initials'>
                                {getInitials(user.fullName)}
                            </div>
                        )}
                
                <span className='user-greeting'>Hi, {user.fullName}</span>

                {searchResults.length > 0 && (
                    <div className='search-results'>
                        <h3>Search Results:</h3>
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.id} onClick={() => navigate(`/issue/${result.id}`)}>
                                    <strong>{result.title}</strong>: {result.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
    );
};

export default Navbar;