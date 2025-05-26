import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import search from '../assets/search.png';
import more from '../assets/more.png';
import emptybox from '../assets/emptybox.png';
import './openissues.css';
import { issueAPI } from '../services/api';

const OpenIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [subDropdownVisible, setSubDropdownVisible] = useState(null);
    const [assigningIssue, setAssigningIssue] = useState(null);

    // Mock lecturers - you might want to fetch this from an API too
    const lecturers = [
        { id: 1, name: 'Mrs. Aloi', email: 'aloi@university.edu' },
        { id: 2, name: 'Mr. Lule', email: 'lule@university.edu' },
        { id: 3, name: 'Dr. Ngobiri', email: 'ngobiri@university.edu' }
    ];

    const toggleDropdown = (index) => {
        setDropdownVisible(dropdownVisible === index ? null : index);
        setSubDropdownVisible(null);
    };

    const handleAssignIssue = async (issueId, lecturer) => {
        try {
            setAssigningIssue(issueId);
            
            // Use the existing issueAPI
            await issueAPI.assignIssue(issueId, lecturer.id);
            
            // Refresh issues after assignment
            await fetchIssues();
            
            // Close dropdowns
            setDropdownVisible(null);
            setSubDropdownVisible(null);
            
            // Show success message
            alert(`Issue has been successfully assigned to ${lecturer.name}`);
            
            // Add notification to localStorage (if you still want to use this)
            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
            const newNotification = {
                id: notifications.length + 1,
                message: `Issue assigned to ${lecturer.name}`,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            };
            const updatedNotifications = [...notifications, newNotification];
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
            
        } catch (error) {
            console.error('Error assigning issue:', error);
            alert(`Failed to assign issue to ${lecturer.name}. ${error.message || error}`);
        } finally {
            setAssigningIssue(null);
        }
    };

    const toggleSubDropdown = (index) => {
        setSubDropdownVisible(subDropdownVisible === index ? null : index);
    };

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await issueAPI.getIssues();
            setIssues(data);
        } catch (err) {
            console.error('Error fetching issues:', err);
            setError(err.message || 'Failed to fetch issues');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredIssues = issues.filter(issue => {
        // Filter by status
        let statusMatch = true;
        if (selectedTab !== 'all') {
            const issueStatus = issue.status ? issue.status.toLowerCase() : '';
            if (selectedTab === 'in-progress') {
                statusMatch = issueStatus === 'in-progress' || issueStatus === 'in_progress';
            } else {
                statusMatch = issueStatus === selectedTab;
            }
        }

        // Filter by search term
        let searchMatch = true;
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            searchMatch = (
                (issue.title && issue.title.toLowerCase().includes(searchLower)) ||
                (issue.description && issue.description.toLowerCase().includes(searchLower)) ||
                (issue.category && issue.category.toLowerCase().includes(searchLower)) ||
                (issue.student && issue.student.email && issue.student.email.toLowerCase().includes(searchLower))
            );
        }

        return statusMatch && searchMatch;
    });

    const getStatusCounts = () => {
        return {
            pending: issues.filter(issue => issue.status && issue.status.toLowerCase() === 'pending').length,
            inProgress: issues.filter(issue => {
                const status = issue.status ? issue.status.toLowerCase() : '';
                return status === 'in-progress' || status === 'in_progress';
            }).length,
            resolved: issues.filter(issue => issue.status && issue.status.toLowerCase() === 'resolved').length,
        };
    };

    const statusCounts = getStatusCounts();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getStatusDisplayName = (status) => {
        if (!status) return 'Unknown';
        if (status.toLowerCase() === 'in_progress') return 'In-Progress';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <div className='open-issues-container'>
                <Navbar />
                <Sidebar />
                <div className='open-issues-content'>
                    <h1>Assigned Issues</h1>
                    <div className="loading-container">
                        <p>Loading issues...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='open-issues-container'>
                <Navbar />
                <Sidebar />
                <div className='open-issues-content'>
                    <h1>Assigned Issues</h1>
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button onClick={fetchIssues}>Retry</button>
                    </div>
                </div>
            </div>
        );
    }

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
                        Pending ({statusCounts.pending})
                    </button>
                    <button
                        className={`nav-button ${selectedTab === 'in-progress' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('in-progress')}
                    >
                        In-Progress ({statusCounts.inProgress})
                    </button>
                    <button
                        className={`nav-button ${selectedTab === 'resolved' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('resolved')}
                    >
                        Resolved ({statusCounts.resolved})
                    </button>
                    <button
                        className={`nav-button ${selectedTab === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('all')}
                    >
                        All ({issues.length})
                    </button>
                </div>
                <div className='issue'>
                    <p>Issues</p>
                    <div className='myissuescontainer'>
                        <input
                            type='text'
                            placeholder='Search for anything...'
                            className='myissuesinput'
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <img src={search} alt='search' className='myissuesicon' />
                    </div>
                </div>
                <div className='filter-issues-container'>
                    <select 
                        className='filter-issues'
                        value={selectedTab}
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
                        <div className='item'>Student</div>
                        <div className='item'>Actions</div>
                    </div>
                    <div className='body'>
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue, index) => (
                                <div className='issue-table-row' key={issue.id || index}>
                                    <div className='issue-item'>
                                        <div className="issue-title">{issue.title || 'Untitled Issue'}</div>
                                        {issue.description && (
                                            <div className="issue-description">
                                                {issue.description.length > 50 ? 
                                                    issue.description.substring(0, 50) + '...' : 
                                                    issue.description
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <div className='issue-item'>
                                        <span className={`status-badge status-${issue.status ? issue.status.toLowerCase().replace('_', '-') : 'unknown'}`}>
                                            {getStatusDisplayName(issue.status)}
                                        </span>
                                    </div>
                                    <div className='issue-item'>{issue.category || 'Uncategorized'}</div>
                                    <div className='issue-item'>{formatDate(issue.created_at)}</div>
                                    <div className='issue-item'>
                                        {issue.student ? issue.student.email : 'Unknown Student'}
                                    </div>
                                    <div className='issue-more-icon'>
                                        <img 
                                            src={more} 
                                            alt='more' 
                                            className='more-icon'
                                            onClick={() => toggleDropdown(index)} 
                                        />
                                        {dropdownVisible === index && (
                                            <div className='lecturer-dropdown-menu'>
                                                <p onClick={() => toggleSubDropdown(index)}>
                                                    {assigningIssue === issue.id ? 'Assigning...' : 'Assign To'}
                                                </p>
                                                {subDropdownVisible === index && (
                                                    <ul className='sub-dropdown-menu'>
                                                        {lecturers.map((lecturer) => (
                                                            <li 
                                                                key={lecturer.id}
                                                                onClick={() => handleAssignIssue(issue.id, lecturer)}
                                                                className={assigningIssue === issue.id ? 'disabled' : ''}
                                                            >
                                                                {lecturer.name}
                                                            </li>
                                                        ))}
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
                                <p>
                                    {searchTerm ? 
                                        `No issues found matching "${searchTerm}"` : 
                                        `There are no ${selectedTab === 'all' ? '' : selectedTab} issues.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenIssues;