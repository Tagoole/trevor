import React, { createContext, useState } from 'react';

export const IssuesContext = createContext();

export const IssuesProvider = ({ children }) => {
    const [issues, setIssues] = useState(() => {
        const storedIssues = JSON.parse(localStorage.getItem('issues')) || [];
        return storedIssues;
    });

    const [notificationMessage, setNotificationMessage] = useState(null);
    const [badgeCount, setBadgeCount] = useState(0); 
    const [registrarBadgeCount, setRegistrarBadgeCount] = useState(0); 

    const addIssue = (newIssue) => {
        setIssues((prevIssues) => {
            const updatedIssues = [...prevIssues, newIssue];
            localStorage.setItem('issues', JSON.stringify(updatedIssues));
            return updatedIssues;
        });

       
        setBadgeCount((prevCount) => prevCount + 1); 
        setRegistrarBadgeCount((prevCount) => prevCount + 1); 
    };

    return (
        <IssuesContext.Provider
            value={{
                issues,
                addIssue,
                notificationMessage,
                setNotificationMessage,
                badgeCount,
                setBadgeCount,
                registrarBadgeCount,
                setRegistrarBadgeCount,
            }}
        >
            {children}
        </IssuesContext.Provider>
    );
};



