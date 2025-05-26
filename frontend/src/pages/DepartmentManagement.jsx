import React, { useState, useEffect } from 'react';
import './DepartmentManagement.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAccess = () => {
            const userInfo = { role: 'registrar' }; 
            if (userInfo.role !== 'registrar') {
                toast.error('Unauthorized access');
                navigate('/dashboard');
            }
        };

        const fetchData = () => {
            const mockDepartments = [
                { id: 1, name: 'Computer Science', code: 'CS' },
                { id: 2, name: 'Mathematics', code: 'MATH' }
            ];
            setDepartments(mockDepartments);
            setLoading(false);
        };

        verifyAccess();
        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDepartment = {
            id: departments.length + 1,
            name: formData.name,
            code: formData.code
        };
        setDepartments([...departments, newDepartment]);
        toast.success('Department created successfully');
        setFormData({ name: '', code: '' });
    };

    const handleDelete = (departmentId) => {
        const updatedDepartments = departments.filter(dept => dept.id !== departmentId);
        setDepartments(updatedDepartments);
        toast.success('Department deleted successfully');
    };

    if (loading) return <div className="loading">Loading departments...</div>;

    return (
        <div className="department-content">
            <h1>Department Management</h1>
            <div className="management-container">
                <div className="department-form-section">
                    <h2>Create New Department</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Department Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={100}
                                placeholder="E.g. Computer Science"
                            />
                        </div>
                        <div className="form-group">
                            <label>Department Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={10}
                                pattern="[A-Za-z0-9]+"
                                title="Alphanumeric characters only"
                                placeholder="E.g. CS"
                                className="uppercase-input"
                            />
                        </div>
                        <button type="submit" className="department-submit-button">
                            Create Department
                        </button>
                    </form>
                </div>
                <div className="list-section">
                    <h2>Existing Departments</h2>
                    {departments.length > 0 ? (
                        <div className="table-container">
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map(dept => (
                                        <tr key={dept.id}>
                                            <td>{dept.name}</td>
                                            <td>{dept.code}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(dept.id)}
                                                    className="department-delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No departments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentManagement;
