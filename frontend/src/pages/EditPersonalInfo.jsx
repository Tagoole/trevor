import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditPersonalInfo.css';

const EditPersonalInfo = () => {
    const navigate = useNavigate();

    
    const [personalInfo, setPersonalInfo] = useState({
        fullName: localStorage.getItem('fullName') || '',
        address: localStorage.getItem('address') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || '',
        gender: localStorage.getItem('gender') || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSave = () => {
        
        localStorage.setItem('fullName', personalInfo.fullName);
        localStorage.setItem('address', personalInfo.address);
        localStorage.setItem('phoneNumber', personalInfo.phoneNumber);
        localStorage.setItem('gender', personalInfo.gender);

        alert('Personal information updated successfully!');
        navigate('/app/profile'); 
    };

    return (
        <div className='edit-personal-info-container'>
            <h1 className='edit-peersonal-info-h1'>Edit Personal Information</h1>
            <form>

                <br />
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handleChange}
                        className='address-info'
                    />
                </label>
                <br />
                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={personalInfo.phoneNumber}
                        onChange={handleChange}
                        className='phone-number-info'
                    />
                </label>
                <br />
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={personalInfo.gender}
                        onChange={handleChange}
                        className='gender-info'
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                <br />
                <button type="button" onClick={handleSave} className='personal-info-button'>
                    Save
                </button>
            </form>
        </div>
    );
};

export default EditPersonalInfo;