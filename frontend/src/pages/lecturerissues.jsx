import React, { useState, useEffect } from 'react';
import './lecturerissues.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import search from '../assets/search.png';
import emptybox from '../assets/emptybox.png';
import { useNavigate } from 'react-router-dom';


const LecturerIssues = () => {
    const [issues, setIssues] = useState([]);
    const [filterstatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedIssues = JSON.parse(localStorage.getItem('issues')) || [];
        setIssues(storedIssues);
    }, []);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleIssueClick = (id) => {
        navigate(`/lecturer/issue/${id}`);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'in-progress':
                return 'status-in-progress';
            case 'resolved':
                return 'status-resolved';
            default:
                return '';
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filterstatus === 'all' || issue.status.toLowerCase() === filterstatus;
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className='lecturer-issue-screen'>
            <Navbar />  
            <Sidebar />
            <div className='lecturer-issue-content'>
                <h1>Assigned Issues</h1>
                <div className='filter-search-container'>
                    <select
                        className='filter-dropdown'
                        value={filterstatus}
                        onChange={handleFilterChange}>
                            <option value={"all"}>All</option>
                            <option value={"pending"}>Pending</option>
                            <option value={"in-progress"}>In-progress</option>
                            <option value={"resolved"}>Resolved</option>
                    </select>
                    <div className='lecturer-search-container'>
                        <input
                            type='text'
                            placeholder='Search Issues...'
                            className='lecturer-search-input'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <img src={search} alt='search' className='lecturer-search-icon' />
                    </div>
                </div>
                <div className="issues-table">
                    <div className="table-header">
                        <div className="table-header-items">Issue</div>
                        <div className="table-header-items">Status</div>
                        <div className="table-header-items">Category</div>
                        <div className="table-header-items">Date</div>
                    </div>
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue, index) => (
                            <div 
                                key={index} 
                                className="table-rows" 
                                onClick={() => handleIssueClick(issue.id)}>
                                <div className="table-row-items">{issue.title}</div>
                                <div className={`table-row-items status ${getStatusClass(issue.status)}`}>
                                    {issue.status}
                                </div>
                                <div className="table-row-items">{issue.category}</div>
                                <div className="table-row-items">{issue.date}</div>
                            </div>
                        ))
                    ) : (
                        <div className="no-issues-container">
                            <img src={emptybox} alt="No issues" className="no-issues-icon" />
                            <p>No issues found. Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default LecturerIssues;