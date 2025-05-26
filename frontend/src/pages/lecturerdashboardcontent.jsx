import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './lecturerdashboardcontent.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import search from '../assets/search.png';
import emptybox from '../assets/emptybox.png';

const LecturerDashboardContent = () => {
    const [issues, setIssues] = useState([]);
    const [assignedIssues, setAssignedIssues] = useState(0);
    const [pendingIssues, setPendingIssues] = useState(0);
    const [inProgressIssues, setInProgressIssues] = useState(0);
    const [resolvedIssues, setResolvedIssues] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const loadIssues = () => {
            const storedIssues = JSON.parse(localStorage.getItem('issues')) || [];
            setIssues(storedIssues);

            const assignedCount = storedIssues.length;
            const pendingCount = storedIssues.filter(issue => issue.status.toLowerCase() === 'pending').length;
            const inProgressCount = storedIssues.filter(issue => issue.status.toLowerCase() === 'in-progress').length;
            const resolvedCount = storedIssues.filter(issue => issue.status.toLowerCase() === 'resolved').length;

            setAssignedIssues(assignedCount);
            setPendingIssues(pendingCount);
            setInProgressIssues(inProgressCount);
            setResolvedIssues(resolvedCount);
        };

        loadIssues();

        window.addEventListener('storage', loadIssues);

        return () => {
            window.removeEventListener('storage', loadIssues);
        };
    }, []);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filterStatus === 'all' || issue.status.toLowerCase() === filterStatus;
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleOpenIssuesClick = () => {
        navigate('/lecturer/lecturerissue');
    };

    const LecturerNotifications = () => {
        const [notifications, setNotifications] = useState([]);

        useEffect(() => {
            const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
            setNotifications(storedNotifications.filter(notification => notification.lecturer === "Dr. Ngobiri"));
        }, []);
        
      } 

    return (
        <div className='lecturer-dashboard-container'>
            <Navbar />
            <Sidebar />
            <div className="lecturer-dashboard-content">
                <h1>Dashboard</h1>
                <div className="lecturer-card-container">
                    <div className="assigned-card">
                        <h2>Assigned Issues</h2>
                        <p>{assignedIssues}</p>
                        <p>You have {assignedIssues} assigned issues</p>
                    </div>
                    <div className="pending-card">
                        <h2>Pending Issues</h2>
                        <p>{pendingIssues}</p>
                        <p>You have {pendingIssues} pending issues</p>
                    </div>
                    <div className="in-progress-card">
                        <h2>In-Progress Issues</h2>
                        <p>{inProgressIssues}</p>
                        <p>You have {inProgressIssues} in-progress issues</p>
                    </div>
                    <div className="resolved-card">
                        <h2>Resolved Issues</h2>
                        <p>{resolvedIssues}</p>
                        <p>You have {resolvedIssues} resolved issues</p>
                    </div>
                </div>
                <p className="recent">Recent Actions</p>
                <div className="lecturer-recent">
                    <p className="assigned">Assigned Issues</p>
                    <button
                        className="open-issues-button"
                        onClick={handleOpenIssuesClick}>
                        Open Issues
                    </button>
                    <div className='filter-issue-container'>
                        <select
                            className='filter-issue'
                            value={filterStatus}
                            onChange={handleFilterChange}>
                            <option value='all'>All</option>
                            <option value='pending'>Pending</option>
                            <option value='in-progress'>In-progress</option>
                            <option value='resolved'>Resolved</option>
                        </select>
                    </div>
                    <div className='myissuessearchcontainer'>
                        <input
                            type='text'
                            placeholder='Search for anything...'
                            className='myissuessearchinput'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <img src={search} alt='search' className='myissuessearchicon' />
                    </div>
                    <div className='issuestable'>
                        <div className='tableheader'>
                            <div className='tableheader-item'>Issue</div>
                            <div className='tableheader-item'>Status</div>
                            <div className='tableheader-item'>Category</div>
                            <div className='tableheader-item'>Date</div>
                        </div>
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue, index) => (
                                <div key={index} className='table-row'>
                                    <div className='table-row-item'>{issue.title}</div>
                                    <div className='table-row-item'>{issue.status}</div>
                                    <div className='table-row-item'>{issue.category}</div>
                                    <div className='table-row-item'>{issue.date}</div>
                                </div>
                            ))
                        ) : (
                            <div className="lecturer-issues-container">
                                <img src={emptybox} alt="emptybox" className="emptyboxicon" />
                                <p>There are no recent issues worked upon.<br />Kindly click <b>Open Issues</b> to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboardContent;