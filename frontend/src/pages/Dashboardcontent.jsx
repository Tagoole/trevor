import React, { useState, useEffect } from 'react';
import './Dashboardcontent.css';
import search from '../assets/search.png';
import add from '../assets/add.png';
import emptybox from '../assets/emptybox.png';
import { Link, useNavigate } from 'react-router-dom';
import { issueAPI } from '../services/api'

const DashboardContent = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch issues on component mount
    useEffect(() => {
        fetchIssues();
    }, []);

    // Filter issues when issues, filterStatus, or searchTerm changes
    useEffect(() => {
        console.log('Filtering issues:', {
            totalIssues: issues.length,
            filterStatus,
            searchTerm,
            issues: issues
        });

        let filtered = Array.isArray(issues) ? [...issues] : [];

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(issue => issue.status === filterStatus);
            console.log('After status filter:', filtered.length, 'issues');
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(issue => {
                const title = issue.title ? issue.title.toLowerCase() : '';
                const category = issue.category ? issue.category.toLowerCase() : '';
                const status = issue.status ? issue.status.toLowerCase() : '';
                const searchLower = searchTerm.toLowerCase();
                
                return title.includes(searchLower) || 
                       category.includes(searchLower) || 
                       status.includes(searchLower);
            });
            console.log('After search filter:', filtered.length, 'issues');
        }

        console.log('Final filtered issues:', filtered);
        setFilteredIssues(filtered);
    }, [issues, filterStatus, searchTerm]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Starting to fetch issues...');
            
            // Check if user is authenticated
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            console.log('Auth token exists:', !!token);
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            const response = await issueAPI.getIssues();
            
            console.log('Raw API response:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', response ? Object.keys(response) : 'null response');
            
            let issuesData = [];
            
            // Handle different response structures
            if (response && response.data) {
                console.log('Using response.data');
                issuesData = Array.isArray(response.data) ? response.data : [];
            } else if (response && Array.isArray(response)) {
                console.log('Using response directly (array)');
                issuesData = response;
            } else if (response && response.results) {
                console.log('Using response.results (paginated)');
                issuesData = Array.isArray(response.results) ? response.results : [];
            } else {
                console.log('Unknown response structure, defaulting to empty array');
                issuesData = [];
            }
            
            console.log('Final issues data:', issuesData);
            console.log('Issues count:', issuesData.length);
            
            setIssues(issuesData);
            
        } catch (err) {
            console.error('Error fetching issues:', err);
            console.error('Error details:', {
                message: err.message,
                status: err.status,
                response: err.response,
                stack: err.stack
            });
            
            let errorMessage = 'Failed to fetch issues. ';
            
            if (err.message && err.message.includes('authentication')) {
                errorMessage += 'Please log in again.';
                // Optionally redirect to login
                // navigate('/login');
            } else if (err.status === 401) {
                errorMessage += 'Authentication failed. Please log in again.';
            } else if (err.status === 403) {
                errorMessage += 'You do not have permission to view issues.';
            } else if (err.status === 500) {
                errorMessage += 'Server error. Please try again later.';
            } else {
                errorMessage += 'Please check your connection and try again.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event) => {
        console.log('Filter changed to:', event.target.value);
        setFilterStatus(event.target.value);
    };

    const handleSearchChange = (event) => {
        console.log('Search term changed to:', event.target.value);
        setSearchTerm(event.target.value);
    };

    const handleIssueClick = (id) => {
        console.log('Navigating to issue:', id);
        navigate(`/app/issue/${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    const getStatusCount = (status) => {
        if (!Array.isArray(issues)) return 0;
        const count = issues.filter(issue => issue && issue.status === status).length;
        console.log(`Status count for ${status}:`, count);
        return count;
    };

    // Add this useEffect to log state changes
    useEffect(() => {
        console.log('Issues state updated:', {
            issuesLength: Array.isArray(issues) ? issues.length : 'not array',
            issues: issues,
            filteredIssuesLength: Array.isArray(filteredIssues) ? filteredIssues.length : 'not array',
            filteredIssues: filteredIssues
        });
    }, [issues, filteredIssues]);

    if (loading) {
        return (
            <div className='dashboard-content'>
                <h1>Dashboard</h1>
                <div className='loading-container'>
                    <p>Loading your issues...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='dashboard-content'>
                <h1>Dashboard</h1>
                <div className='error-container'>
                    <p className='error-message'>{error}</p>
                    <button onClick={fetchIssues} className='retry-button'>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='dashboard-content'>
            <h1>Dashboard</h1>
            <div className='cards-container'>
                <div className='card pending'>
                    <h2>Pending Issues</h2>
                    <p className='issue-count'>{getStatusCount('pending')}</p>
                    <p>You have {getStatusCount('pending')} pending issues.</p>
                </div>
                <div className='card in-progress'>
                    <h2>In-progress Issues</h2>
                    <p className='issue-count'>{getStatusCount('in-progress')}</p>
                    <p>You have {getStatusCount('in-progress')} in-progress issues.</p>
                </div>
                <div className='card resolved'>
                    <h2>Resolved Issues</h2>
                    <p className='issue-count'>{getStatusCount('resolved')}</p>
                    <p>You have {getStatusCount('resolved')} resolved issues.</p>
                </div>
            </div>
            <div className='recent-actions'>
                <h2>Recent Actions</h2>
            </div>
            <div className='my-issues'>
                <h2 className='my-issues-title'>My Issues</h2>
                <Link to="/app/issueform">
                    <button className='new-issue-button'>
                        <img src={add} alt='add' className='add-icon' />
                        New Issue
                    </button>
                </Link>
                <div className='filter-select-container'>
                    <select className='filter-select' value={filterStatus} onChange={handleFilterChange}>
                        <option value='all'>All</option>
                        <option value='pending'>Pending</option>
                        <option value='in-progress'>In-progress</option>
                        <option value='resolved'>Resolved</option>
                    </select>
                </div>
                <div className='my-issues-search-container'>
                    <input 
                        type='text' 
                        placeholder='Search for anything...' 
                        className='my-issues-search-input'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <img src={search} alt='search' className='my-issues-search-icon' />
                </div>
                <div className='issues-table'>
                    <div className='table-header'>
                        <div className='table-header-item'>Issue</div>
                        <div className='table-header-item'>Status</div>
                        <div className='table-header-item'>Category</div>
                        <div className='table-header-item'>Date</div>
                    </div>
                    <div className='table-body'>
                        {Array.isArray(filteredIssues) && filteredIssues.length > 0 ? (
                            filteredIssues.map((issue) => (
                                <div key={issue.id} className='table-row' onClick={() => handleIssueClick(issue.id)}>
                                    <div className='table-row-item'>{issue.title || 'Untitled'}</div>
                                    <div className='table-row-item'>
                                        <span className={`status-badge ${issue.status || 'unknown'}`}>
                                            {issue.status || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className='table-row-item'>{issue.category || 'Uncategorized'}</div>
                                    <div className='table-row-item'>{formatDate(issue.created_at || issue.date)}</div>
                                </div>
                            ))
                        ) : (
                            <div className='empty-image-container'>
                                <img src={emptybox} alt='emptybox' className='emptybox-icon' />
                                <p className='emptybox-p'>
                                    {searchTerm || filterStatus !== 'all' 
                                        ? 'No issues match your current filters.' 
                                        : 'There are no recent issues added.'
                                    }<br />
                                    {!searchTerm && filterStatus === 'all' && (
                                        <>Kindly click <b>New Issue</b> to get started</>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>    
                
                {/* Debug information in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '12px' }}>
                        <h4>Debug Info:</h4>
                        <p>Total Issues: {Array.isArray(issues) ? issues.length : 'Not an array'}</p>
                        <p>Filtered Issues: {Array.isArray(filteredIssues) ? filteredIssues.length : 'Not an array'}</p>
                        <p>Filter Status: {filterStatus}</p>
                        <p>Search Term: {searchTerm}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardContent;