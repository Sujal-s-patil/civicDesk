import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/UserNav.css';
import { clearStoredUser, getStoredUser } from '../utils/auth.js';

const UserNav = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const profilePopupRef = useRef(null);
  const logoutConfirmationRef = useRef(null);
  const navigate = useNavigate();
  const userData = getStoredUser();

  const toggleProfilePopup = () => {
    if (showProfilePopup) {
      const popupElement = profilePopupRef.current;
      if (popupElement) {
        popupElement.classList.add('closing');
        setTimeout(() => {
          setShowProfilePopup(false);
        }, 300);
      } else {
        setShowProfilePopup(false);
      }
    } else {
      setShowProfilePopup(true);
    }
  };

  const closeProfilePopup = () => {
    const popupElement = profilePopupRef.current;
    if (popupElement) {
      popupElement.classList.add('closing');
      setTimeout(() => {
        setShowProfilePopup(false);
      }, 300);
    } else {
      setShowProfilePopup(false);
    }
  };

  const showLogoutConfirmationPopup = () => {
    setShowLogoutConfirmation(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleLogout = () => {
    clearStoredUser();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target) && !event.target.closest('.profile-circle')) {
        const popupElement = profilePopupRef.current;
        popupElement.classList.add('closing');
        setTimeout(() => {
          setShowProfilePopup(false);
        }, 300);
      }
    };

    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutConfirmationRef.current && !logoutConfirmationRef.current.contains(event.target) && !event.target.closest('.logout-button')) {
        setShowLogoutConfirmation(false);
      }
    };

    if (showLogoutConfirmation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutConfirmation]);

  return (
    <>
      <div className="user-profile-container">
        <div className="user-profile">
          <div className="profile-circle" onClick={toggleProfilePopup}>
            <div className="profile-content">
              {userData?.photo ? (
                <img src={userData.photo} alt={userData.full_name || 'Profile'} className="profile-photo" />
              ) : (
                <svg className="profile-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}

              <span className="profile-text">Profile</span>
            </div>
          </div>
          {showProfilePopup && (
            <div className="profile-popup-container" ref={profilePopupRef}>
              <div className="profile-popup-header">
                <h3>User Profile</h3>
                <button className="profile-close-btn" onClick={closeProfilePopup}>✖</button>
              </div>
              <div className="profile-popup-content">
                <div className="profile-info-item">
                  <span className="profile-info-label">Name:</span>
                  <span className="profile-info-value">{userData?.full_name || 'N/A'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Aadhar No:</span>
                  <span className="profile-info-value">{userData?.aadhar_card || 'N/A'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Phone No:</span>
                  <span className="profile-info-value">{userData?.phone_no || 'N/A'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Address:</span>
                  <span className="profile-info-value">{[userData?.address, userData?.city, userData?.state].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="logout-button" onClick={showLogoutConfirmationPopup}>
          <span className="logout-icon">⏻</span>
        </button>
      </div>

      {showLogoutConfirmation && (
        <div className="logout-confirmation-overlay">
          <div className="logout-confirmation-popup" ref={logoutConfirmationRef}>
            <div className="logout-confirmation-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-confirmation-content">
              <p className="logout-confirmation-message">Are you sure you want to log out?</p>
              <div className="logout-confirmation-buttons">
                <button className="logout-confirm-btn cancel" onClick={cancelLogout}>Cancel</button>
                <button className="logout-confirm-btn confirm" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNav;