import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditAcademicInfo.css';

const EditAcademicInfo = () => {
    const navigate = useNavigate();

    const [academicInfo, setAcademicInfo] = useState({
        registrationNumber: localStorage.getItem('registrationNumber') || '',
        studentNumber: localStorage.getItem('studentNumber') || '',
        course: localStorage.getItem('course') || '',
        semester: localStorage.getItem('semester') || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAcademicInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSave = () => {
        
        localStorage.setItem('registrationNumber', academicInfo.registrationNumber);
        localStorage.setItem('studentNumber', academicInfo.studentNumber);
        localStorage.setItem('course', academicInfo.course);
        localStorage.setItem('semester', academicInfo.semester);

        
        setTimeout(() => {
            alert('Academic information updated successfully!');
            navigate('/app/profile'); 
        }, 0); 
    };

    return (
        <div className="edit-academic-info-container">
            <h1 className="edit-academic-info-h1">Edit Academic Information</h1>
            <form>
                <label>
                    Registration Number:
                    <input
                        type="text"
                        name="registrationNumber"
                        value={academicInfo.registrationNumber}
                        onChange={handleChange}
                        className="registration-number-info"
                    />
                </label>
                <br />
                <label>
                    Student Number:
                    <input
                        type="text"
                        name="studentNumber"
                        value={academicInfo.studentNumber}
                        onChange={handleChange}
                        className="student-number-info"
                    />
                </label>
                <br />
                <label>
                    Course:
                    <input
                        type="text"
                        name="course"
                        value={academicInfo.course}
                        onChange={handleChange}
                        className="course-info"
                    />
                </label>
                <br />
                <label>
                    Semester:
                    <input
                        type="text"
                        name="semester"
                        value={academicInfo.semester}
                        onChange={handleChange}
                        className="semester-info"
                    />
                </label>
                <br />
                <button
                    type="button"
                    onClick={handleSave}
                    className="academic-info-button"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default EditAcademicInfo;