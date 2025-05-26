import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './registrardashboardcontent.css';
import filter from '../assets/filter.png';
import emptybox from '../assets/emptybox.png';
import search from '../assets/search.png';
import { IssuesContext } from "../context/IssueContext";
import { issueAPI } from '../services/api';

const RegistrarDashboardContent = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const {registrarBadgeCount, setRegistrarBadgeCount} = useContext(IssuesContext);
    const [assignedIssues, setAssignedIssues] = useState(0);
    const [pendingIssues, setPendingIssues] = useState(0);
    const [inProgressIssues, setInProgressIssues] = useState(0);
    const [resolvedIssues, setResolvedIssues] = useState(0);

    const navigate = useNavigate();

    // Fetch issues from API
    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await issueAPI.getIssues();
            setIssues(data);
            setFilteredIssues(data);
            
            // Calculate counts based on actual API data
            const assignedCount = data.length;
            const pendingCount = data.filter(issue => 
                issue.status && issue.status.toLowerCase() === 'pending'
            ).length;
            const inProgressCount = data.filter(issue => 
                issue.status && (issue.status.toLowerCase() === 'in-progress' || issue.status.toLowerCase() === 'in_progress')
            ).length;
            const resolvedCount = data.filter(issue => 
                issue.status && issue.status.toLowerCase() === 'resolved'
            ).length;

            setAssignedIssues(assignedCount);
            setPendingIssues(pendingCount);
            setInProgressIssues(inProgressCount);
            setResolvedIssues(resolvedCount);

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

    // Filter and search functionality
    useEffect(() => {
        let filtered = issues;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(issue => {
                if (!issue.status) return false;
                const issueStatus = issue.status.toLowerCase();
                if (filterStatus === 'in-progress') {
                    return issueStatus === 'in-progress' || issueStatus === 'in_progress';
                }
                return issueStatus === filterStatus;
            });
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(issue => 
                (issue.title && issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (issue.category && issue.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (issue.student && issue.student.email && issue.student.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredIssues(filtered);
    }, [issues, filterStatus, searchTerm]);

    const handleOpenIssuesClick = () => {
        setRegistrarBadgeCount(0); 
        navigate('/registrar-dashboard/openissues');
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
            <div className="registrar-dashboard-content">
                <h1>Dashboard</h1>
                <div className="loading-container">
                    <p>Loading issues...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="registrar-dashboard-content">
                <h1>Dashboard</h1>
                <div className="error-container">
                    <p>Error: {error}</p>
                    <button onClick={fetchIssues}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="registrar-dashboard-content">
            <h1>Dashboard</h1>
            <div className="registrar-card-container">
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
            <div className="registrar-recent">
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
                    <img src={filter} alt='filter' className='issuefiltericon' /> 
                </div>
                <div className='myissuessearchcontainer'>
                    <input 
                        type='text' 
                        placeholder='Search for anything...' 
                        className='myissuessearchinput'
                        value={searchTerm}
                        onChange={handleSearchChange} />
                    <img src={search} alt='search' className='myissuessearchicon' />
                </div>
                <div className='issuestable'>
                    <div className='tableheader'>
                        <div className='tableheader-item'>Issue</div>
                        <div className='tableheader-item'>Status</div>
                        <div className='tableheader-item'>Category</div>
                        <div className='tableheader-item'>Date</div>
                        <div className='tableheader-item'>Student</div>
                    </div>
                    {filteredIssues.length === 0 ? (
                        <div className="registrar-issues-container">
                            <img src={emptybox} alt="emptybox" className="emptyboxicon" />
                            {searchTerm || filterStatus !== 'all' ? (
                                <p>No issues found matching your criteria.<br/>Try adjusting your search or filter.</p>
                            ) : (
                                <p>There are no recent issues worked upon.<br/>Kindly click <b>Open Issues</b> to get started.</p>
                            )}
                        </div>
                    ) : (
                        <div className="issues-list">
                            {filteredIssues.slice(0, 5).map((issue) => (
                                <div key={issue.id} className="issue-row">
                                    <div className="issue-cell">
                                        <div className="issue-title">{issue.title || 'Untitled Issue'}</div>
                                        <div className="issue-description">
                                            {issue.description ? 
                                                (issue.description.length > 50 ? 
                                                    issue.description.substring(0, 50) + '...' : 
                                                    issue.description
                                                ) : 
                                                'No description'
                                            }
                                        </div>
                                    </div>
                                    <div className="issue-cell">
                                        <span className={`status-badge status-${issue.status ? issue.status.toLowerCase().replace('_', '-') : 'unknown'}`}>
                                            {getStatusDisplayName(issue.status)}
                                        </span>
                                    </div>
                                    <div className="issue-cell">{issue.category || 'Uncategorized'}</div>
                                    <div className="issue-cell">{formatDate(issue.created_at)}</div>
                                    <div className="issue-cell">
                                        {issue.student ? issue.student.email : 'Unknown Student'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrarDashboardContent;