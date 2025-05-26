import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import './studentdashboard.css';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { toast } from 'react-toastify';

const RegistrarDashboard = () => {
    const [allIssues, setAllIssues] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Set user role in localStorage
    useEffect(() => {
        localStorage.setItem('userRole', 'registrar');
    }, []);

    const fetchData = () => {
        // Mock data fetching
        setLoading(true);

        const mockIssues = [
            { id: 1, title: 'Missing Marks', status: 'Pending', assignedTo: null },
            { id: 2, title: 'Appeal for Grade', status: 'In-progress', assignedTo: 'Dr. Lule Bosco' },
        ];

        const mockLecturers = [
            { id: 1, name: 'Dr. Lule Bosco' },
            { id: 2, name: 'Dr. Waswa Shafick' },
            { id: 3, name: 'Mrs. Aloi' },
        ];

        setTimeout(() => {
            setAllIssues(mockIssues);
            setLecturers(mockLecturers);
            setLoading(false);
        }, 1000); // Simulate network delay
    };

    const handleAssign = (issueId, lecturerId) => {
        // Mock issue assignment
        const updatedIssues = allIssues.map(issue => {
            if (issue.id === issueId) {
                const assignedLecturer = lecturers.find(lecturer => lecturer.id === lecturerId);
                return { ...issue, status: 'In-progress', assignedTo: assignedLecturer.name };
            }
            return issue;
        });

        setAllIssues(updatedIssues);
        toast.success('Issue assigned successfully');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />
            <Sidebar />
            <div className="dashboard-content">
                <Outlet context={{
                    allIssues,
                    lecturers,
                    loading,
                    onAssignIssue: handleAssign
                }} />
            </div>
        </div>
    );
};

export default RegistrarDashboard;

