import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IssuesContext } from '../context/IssueContext';
import './issuedetails.css';

const IssueDetails = () => {
    const { id } = useParams();
    const { issues, setIssues } = useContext(IssuesContext);
    const navigate = useNavigate();
    const issue = issues.find((issue) => issue.id === id );

    const [comment, setComment] = useState('');
    const [status, setStatus] = useState(issue?.status || '');

    if (!issue) {
        return <p>Issue not found. Please check the issue ID.</p>;
    }
    
    useEffect(() => {
        if (issue && issue.status === 'pending') {
            
            const updatedIssues = issues.map((i) => {
                if (i.id === issue.id) {
                    return { ...i, status: 'in-progress' };
                }
                return i;
            });

            setIssues(updatedIssues);
            localStorage.setItem('issues', JSON.stringify(updatedIssues));

        
            sendNotification(issue.studentId, 'Your issue is now in progress.');
        }
    }, [issue, issues, setIssues]);

    const handleStatusUpdate = () => {
        const updatedIssues = issues.map((i) => {
            if (i.id === issue.id) {
                return { ...i, status: 'resolved', comment };
            }
            return i;
        });

        setIssues(updatedIssues);
        localStorage.setItem('issues', JSON.stringify(updatedIssues));

        
        sendNotification(issue.studentId, 'Your issue has been resolved.');

        navigate('/lecturer/lecturerissue'); 
    };

    const sendNotification = (studentId, message) => {
        try {
            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
            const newNotification = {
                id: notifications.length + 1,
                studentId,
                message,
                date: new Date().toLocaleString(),
            };
            const updatedNotifications = [...notifications, newNotification];
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    };

    return (
        <div className='issue-detail-container'>
            <h1>Issue Details</h1>
            <div className='issue-detail'>
                <p><strong>Title:</strong> {issue.title}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Category:</strong> {issue.category}</p>
                <p><strong>Registrar:</strong> {issue.registrar}</p>
                <p><strong>Lecturer:</strong> {issue.lecturer}</p>
                <p><strong>Course Name:</strong> {issue.coursename}</p>
                <p><strong>Course Code:</strong> {issue.coursecode}</p>
                <p><strong>Status:</strong> {issue.status}</p>
                <p><strong>Date:</strong> {issue.date}</p>
                {issue.attachment && (
                    <div>
                        <strong>Attachment:</strong>
                        <img
                            src={URL.createObjectURL(issue.attachment)}
                            alt='attachment'
                            className='issue-attachment'
                        />
                    </div>
                )}
            </div>

            
            {issue.status === 'in-progress' && (
                <div className='update-status-section'>
                    <h2>Update Status</h2>
                    <textarea
                        placeholder='Add your comments here...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className='comment-box'
                    />
                    <button onClick={handleStatusUpdate} className='update-button'>
                        Mark as Resolved
                    </button>
                </div>
            )}
        </div>
    );
};

export default IssueDetails;