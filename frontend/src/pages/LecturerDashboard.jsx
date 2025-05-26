import React from "react";
import { Outlet } from "react-router-dom";
import './studentdashboard.css';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const LecturerDashboard = () => {
    const userRole = localStorage.getItem('userRole');
    return (
            <div className="dashboard-container">
                <Navbar />
                <Sidebar />
                <div className="dashboard-content">
                    <Outlet/>
                </div>
            </div>
       
    );
};

export default LecturerDashboard;