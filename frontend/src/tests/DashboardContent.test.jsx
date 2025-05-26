import React from 'react';
import { render, screen } from '@testing-library/react';
import { IssuesContext } from '../context/IssueContext';
import DashboardContent from '../pages/Dashboardcontent';
import { MemoryRouter } from 'react-router-dom';

test('renders the DashboardContent component with correct issue counts', () => {
    const mockIssues = [
        { id: 1, title: 'Issue 1', status: 'pending', category: 'Category 1', date: '2025-04-22'},
        { id: 2, title: 'Issue 2', status: 'in-progress', category: 'Category 2', date: '2025-04-21'},
        { id: 3, title: 'Issue 3', status: 'resolved', category: 'Category 3', date: '2025-04-20'},
    ];

    render(
        <MemoryRouter>
            <IssuesContext.Provider value={{ issues: mockIssues }}>
                <DashboardContent />
            </IssuesContext.Provider>
        </MemoryRouter>
    );

    // Check if the pending issues count is correct
    expect(screen.getByText(/You have 1 pending issues./i)).toBeInTheDocument();

    // Check if the in-progress issues count is correct
    expect(screen.getByText(/You have 1 in-progress issues./i)).toBeInTheDocument();

    // Check if the resolved issues count is correct
    expect(screen.getByText(/You have 1 resolved issues./i)).toBeInTheDocument();
    
});