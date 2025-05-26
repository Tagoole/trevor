import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import dashboard from '../assets/dashboard.png';
import issue from '../assets/issue.png';
import person from '../assets/person.png';
import settings from '../assets/settings.png';
import support from '../assets/support.png';
import logout from '../assets/logout.png';
import department from '../assets/department.png';
import course from '../assets/course.png';

const Sidebar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); 

    const handleLogout = () => {
        //localStorage.removeItem('authToken');
        //localStorage.removeItem('userRole');
        localStorage.clear();
        navigate('/signin');
    };

    
    const basePath = userRole === 'registrar' ? '/registrar-dashboard' : userRole === 'lecturer' ? '/lecturer' : '/app';

    return (
        <div className='sidebar'>
            <ul className='sidebar-menu'>
                <li className='sidebar-item'>
                    <Link to={`${basePath}/dashboard`}> 
                        <img src={dashboard} alt='dashboard' className='sidebar-icon' />
                        Dashboard
                    </Link>
                </li>
                {userRole === 'registrar' && (
                    <>
                        <li className='sidebar-item'>
                            <Link to={`${basePath}/departments`}>
                                <img src={department} alt='department' className='sidebar-icon' />
                                Departments
                            </Link>
                        </li>
                        <li className='sidebar-item'>
                            <Link to={`${basePath}/courses`}>
                                <img src={course} alt='course' className='sidebar-icon' />
                                Courses
                            </Link>
                        </li>
                    </>
                )}
                {userRole === 'lecturer' && (
                    <>
                        <li className='sidebar-item'>
                            <Link to={`${basePath}/lecturerissue`}>
                                <img src={issue} alt='assigned-issues' className='sidebar-icon' />
                                Assigned Issues
                            </Link>
                        </li>
                    </>
                )}
                <li className='sidebar-item'>
                    <Link to={`${basePath}/issues`}>
                        <img src={issue} alt='issue' className='sidebar-icon' />
                        Issues
                    </Link>
                </li>
                <li className='sidebar-item'>
                    <Link to={`${basePath}/profile`}>
                        <img src={person} alt='person' className='sidebar-icon' />
                        Profile
                    </Link>
                </li>
                <li className='sidebar-item'>
                    <Link to={`${basePath}/settings`}>
                        <img src={settings} alt='settings' className='sidebar-icon' />
                        Settings
                    </Link>
                </li>
                <li className='sidebar-item'>
                    <Link to={`${basePath}/support`}>
                        <img src={support} alt='support' className='sidebar-icon' />
                        Help & Support
                    </Link>
                </li>
                <li className='sidebar-item'>
                    <button onClick={handleLogout} className='logout-button'>
                        <img src={logout} alt='logout' className='sidebaricon' />
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;