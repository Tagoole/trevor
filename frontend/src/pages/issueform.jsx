import React, { useState, useRef, useContext, useEffect } from 'react';
import './issueform.css';
import upload from '../assets/upload.png';
import { IssuesContext } from '../context/IssueContext';
import { v4 as uuidv4 } from 'uuid';
import { courseAPI, issueAPI } from '../services/api'

const IssueForm = ({ setBadgeCount }) => {
    const { addIssue, setNotificationMessage } = useContext(IssuesContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        registrar: '',
        lecturer: null, // Set to null instead of empty string
        coursecode: '',
        // coursename: '',
        attachments: null,
        semester: '1',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [registrars, setRegistars] = useState([]);
    const [colleges, setColleges] = useState([]);

    const fileInputRef = useRef(null);

    const getRegistrars = async () => {
        try {
            setRegistars(await courseAPI.fetchRegistrars())
        } catch (error) {
            console.error({error});
            setFetchError("Failed to fetch registrars.");
        }
    }

    const getColleges = async () => {
        try {
            setColleges(await courseAPI.fetchColleges())
        } catch (error) {
            console.error({error});
            setFetchError("Failed to fetch colleges.");
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleFileClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const isFormComplete = () => {
        // return Object.values(formData).every(value => value !== '' && value !== null);
        return Object.entries(formData).every(([key, value]) => {
            if (key === 'attachments' || key === 'lecturer') return true; // Skip validation for optional fields
            return value !== '' && value !== null;
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormComplete()) {
            setError('Please fill in all the required fields.');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        // alert('Form submitted!');
        // return
        try {
            const newIssue = {
                id: uuidv4(),
                ...formData,
                lecturer: null, // Explicitly set lecturer to null
                status: 'pending',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            };
            addIssue(newIssue);

            const mFormData = new FormData();
            mFormData.append('status', 'pending');
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'attachments' && value === null) return;
                if (key === 'lecturer') {
                    // Explicitly append null for lecturer
                    mFormData.append(key, ''); // Or you might want to append 'null' or just skip it
                    return;
                }
                mFormData.append(key, value);
            });
            
            
            const existingIssues = JSON.parse(localStorage.getItem('issues')) || [];
            const updatedIssues = [...existingIssues, newIssue];
            localStorage.setItem('issues', JSON.stringify(updatedIssues));

        
            setNotificationMessage({
                message: 'Your issue has been submitted successfully!',
                date: newIssue.date,
                time: newIssue.time,
            });

            
            if (setBadgeCount) {
                setBadgeCount(prevCount => prevCount + 1);
            };

            console.log({formData, newIssue, mFormData: [...mFormData]})

            // Reset form data with lecturer explicitly set to null
            setFormData({
                title: '',
                description: '',
                category: '',
                registrar: '',
                lecturer: null, // Keep as null
                coursecode: '',
                // coursename: '',
                attachments: null,
                semester: '1',
            });

            try {
                issueAPI.createIssue(mFormData)
                console.log('Form submitted successfully', formData);
            } catch (error) {
                console.error({error});
                setFetchError("Failed to create issue.");
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to submit the issue. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getRegistrars()
        getColleges()
    }, [])

    // console.log({registrars, colleges})
    
    return (
        <div className='issue-form-container'>
            <div className='issue-form-header'>
                <h1>Create a New Issue</h1>
            </div>
            <div className='issue-form-content'>
                
                {error && <p className='error-message'>{error}</p>}
                <label className='registrar-select-label'>
                    Registrar's Name
                    <select
                        name='registrar'
                        value={formData.registrar}
                        onChange={handleChange}
                        className='registrar-select'>
                        {/* <option value=''>Select Registrar</option>
                        <option value='cocis'>COCIS Registrar</option>
                        <option value='cedat'>CEDAT Registrar</option>
                        <option value='chuss'>CHUSS Registrar</option>
                        <option value='caes'>CAES Registrar</option>
                        <option value='cobams'>COBAMS Registrar</option>
                        <option value='cees'>CEES Registrar</option>
                        <option value='chs'>CHS Registrar</option>
                        <option value='conas'>CONAS Registrar</option>
                        <option value='school of law'>School Of Law</option>
                        <option value='covab'>COVAB Registrar</option> */}
                       <option value='' disabled hidden>Select Registrar</option>
                        {registrars.length > 0 && colleges.length > 0 && registrars.map(registrar => {
                            const college = colleges.find(college => college.registrar === registrar.id);
                            return <option key={registrar.id} value={registrar.id}>{`${college.name} Registrar - ${ registrar.fullname}`}</option>
                        })}
                    </select>
                </label>
                <label className='course-code-label'>
                    Course Unit Code
                    <input
                        className='course-code-input'
                        type='text'
                        name='coursecode'
                        placeholder='Enter The Course Code'
                        value={formData.coursecode}
                        onChange={handleChange}
                    />
                </label>
                <label className='semester-select-label'>
                    Semester
                    <select
                        name='semester'
                        value={formData.semester}
                        onChange={handleChange}
                        className='semester-select'>
                       <option value='1'>Semester One</option>
                       <option value='2'>Semester Two</option>
                    </select>
                </label>
                {/* <label className='lecturer-label'>
                    Lecturer's Name
                    <select
                        name='lecturer'
                        value={formData.lecturer}
                        onChange={handleChange}
                        className='lecturer-select'>
                        <option value=''>Select Lecturer</option>
                        <option value='lule'>Dr. Lule Bosco</option>
                        <option value='waswa'>Dr. Waswa Shafick</option>
                        <option value='alvin'>Dr. Alvin David</option>
                        <option value='aloi'>Mrs. Aloi</option>
                        <option value='denish'>Mr. Denish</option>
                        <option value='muwonge'>Mr. Muwonge</option>
                    </select>
                </label> */}
                <label className='upload-label'>
                    Upload Photo
                    <div className='upload-section'>
                        {formData.attachments ? (
                            <img src={URL.createObjectURL(formData.attachments)} alt='selected' className='selected-image' />
                        ) : (
                            <>
                                <img src={upload} alt='upload' className='upload-icon' />
                                <button onClick={handleFileClick} className='upload-link'>Upload a file</button> or drag and drop PNG, JPG
                            </>
                        )}
                        <input
                            type='file'
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept='image/png, image/jpeg'
                            name='attachments'
                            onChange={handleChange}
                        />
                    </div>
                </label>
                <label className='issue-label'>
                    Issue Title
                    <input
                        className='issue-title-input'
                        type='text'
                        name='title'
                        placeholder='Enter Issue Title'
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>
                <label className='issue-label'>
                    Issue Category
                    <select
                        className='issue-select'
                        name='category'
                        value={formData.category}
                        onChange={handleChange}>
                        <option value=''>Select Category</option>
                        <option value='missingmarks'>Missing Marks</option>
                        <option value='appeal'>Appeal</option>
                        <option value='correction'>Correction</option>
                    </select>
                </label>
                <label className='issue-label'>
                    Issue Description
                    <input
                        type='text'
                        name='description'
                        placeholder='Enter the issue description'
                        className='issue-description-input'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                {/* <label className='issue-label'>
                    Course Unit Name
                    <input
                        type='text'
                        name='coursename'
                        placeholder='Enter the Course Unit Name'
                        className='course-name-input'
                        value={formData.coursename}
                        onChange={handleChange}
                    />
                </label> */}
                <button
                    className='issue-submit-button'
                    onClick={handleSubmit}
                    disabled={!isFormComplete() || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default IssueForm;