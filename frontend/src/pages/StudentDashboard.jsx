import React from "react";
import { Outlet } from "react-router-dom";
import './studentdashboard.css';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const StudentDashboard = () => {
    const userRole = localStorage.getItem('userRole');
    return (
            <div className="dashboard-container">
                <Navbar />
                <div className="dashboard-layout">
                    <Sidebar />
                </div>
                <div className="dashboard-content">
                    <Outlet/>
                </div>
            </div>
       
    );
};

export default StudentDashboard;