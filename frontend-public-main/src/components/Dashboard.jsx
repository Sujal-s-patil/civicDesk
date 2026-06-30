import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/Dashboard.css';
import ThemeToggle from './ThemeToggle.jsx';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <ThemeToggle />
      <UserNav />

      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Welcome to the Dashboard. Please select an action:</p>
        <div className="button-container">
          <button className="check-complaint-btn" onClick={() => navigate('/complaints')}>
            Check Complaint
          </button>
          <button className="file-complaint-btn" onClick={() => navigate('/file-complaint')}>
            File a Complaint
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
