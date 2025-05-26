import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import search from '../assets/search.png';
import more from '../assets/more.png';
import emptybox from '../assets/emptybox.png';
import './openissues.css';

const OpenIssues = () => {
    const [issues, setIssues] = useState([]);
    const [selectedTab, setSelectedTab] = useState('pending');
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [subDropdownVisible, setSubDropdownVisible] = useState(null);

    const toggleDropdown = (index)=> {
        setDropdownVisible(dropdownVisible === index ? null : index);
        setSubDropdownVisible(null);
    };

    const toggleSubDropdown = (index, lecturerName) => {
        setSubDropdownVisible(subDropdownVisible === index ? null : index);

        if (lecturerName) {
            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
            const newNotification = {
                id: notifications.length + 1,
                message: `A new issue has been assigned to you.`,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            };
            const updatedNotifications = [...notifications, newNotification];
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

            alert(`Issue has been successfully escalated to ${lecturerName}`);
        }
    };

    useEffect(() => {
        const loadIssues = () => {
            const storedIssues = JSON.parse(localStorage.getItem('issues')) || [];
            setIssues(storedIssues);
    };

    loadIssues();

    window.addEventListener('storage', loadIssues);

    return ()   => {
        window.removeEventListener('storage', loadIssues);
    };
}, []);

    const filteredIssues = issues.filter(issue => {
        if (selectedTab === 'all') return true;
        return issue.status.toLowerCase() === selectedTab;
    });

    const pendingCount = issues.filter(issue => issue.status.toLowerCase() === 'pending').length;

    return (
        <div className='open-issues-container'>
            <Navbar />
            <Sidebar />
            <div className='open-issues-content'>
                <h1>Assigned Issues</h1>
                <div className='issues-navigation'>
                    <button
                        className={`nav-button ${selectedTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('pending')}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        className={`nav-button ${selectedTab === 'in-progress' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('in-progress')}
                    >
                        In-Progress
                    </button>
                    <button
                        className={`nav-button ${selectedTab === 'resolved' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('resolved')}
                    >
                        Resolved
                    </button>
                </div>
                <div className='issue'>
                    <p>Issues</p>
                    <div className='myissuescontainer'>
                        <input
                            type='text'
                            placeholder='Search for anything...'
                            className='myissuesinput'
                        />
                        <img src={search} alt='search' className='myissuesicon' />
                    </div>
                </div>
                <div className='filter-issues-container'>
                    <select 
                    className='filter-issues'
                    onChange={(e) => setSelectedTab(e.target.value)}>
                        <option value='all'>All</option>
                        <option value='pending'>Pending</option>
                        <option value='in-progress'>In-progress</option>
                        <option value='resolved'>Resolved</option>
                    </select>
                </div>
                <div className='table'>
                    <div className='header'>
                        <div className='item'>Issue</div>
                        <div className='item'>Status</div>
                        <div className='item'>Category</div>
                        <div className='item'>Date</div>
                    </div>
                    <div className='body'>
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue, index) => (
                                <div className='issue-table-row' key={index}>
                                    <div className='issue-item'>{issue.title}</div>
                                    <div className='issue-item'>{issue.status}</div>
                                    <div className='issue-item'>{issue.category}</div>
                                    <div className='issue-item'>{issue.date}</div>
                                    <div className='issue-more-icon'>
                                        <img 
                                        src={more} 
                                        alt='more' 
                                        className='more-icon'
                                        onClick={() => toggleDropdown(index)} />
                                        {dropdownVisible === index && (
                                            <div className='lecturer-dropdown-menu'>
                                                <p onClick={() => toggleSubDropdown(index)}>Send To</p>
                                                {subDropdownVisible === index && (
                                                    <ul className='sub-dropdown-menu'>
                                                        <li onClick={() => alert('Issue has been successfully escalated to Mrs. Aloi')}>
                                                            Mrs. Aloi
                                                        </li>
                                                        <li onClick={() => alert('Issue has been successfully escalated to Mr. Lule')}>
                                                            Mr. Lule
                                                        </li>
                                                        <li onClick={() => alert('Issue has been successfully escalated to Dr. Ngobiri')}>
                                                            Dr. Ngobiri
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='emptyboxcontainers'>
                                <img src={emptybox} alt="emptybox" className="emptybox" />
                                <p>There are no {selectedTab} issues.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenIssues;