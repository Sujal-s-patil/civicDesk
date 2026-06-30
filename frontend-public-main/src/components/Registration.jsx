import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Registration.css';
import { request } from '../utils/api.js';
import ThemeToggle from './ThemeToggle.jsx';

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    aadhar_card: '',
    email: '',
    phone_no: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    photo: null,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const backConfirmationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (backConfirmationRef.current && !backConfirmationRef.current.contains(event.target) && !event.target.closest('.back-button')) {
        setShowBackConfirmation(false);
      }
    };

    if (showBackConfirmation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBackConfirmation]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      setFormData((current) => ({ ...current, photo: files?.[0] || null }));
      return;
    }

    if (name === 'aadhar_card' || name === 'phone_no') {
      setFormData((current) => ({ ...current, [name]: value.replace(/\D/g, '') }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  const isFormEmpty = () => {
    const { photo, ...fields } = formData;
    return Object.values(fields).every((val) => val === '') && photo === null;
  };

  const showBackConfirmationPopup = () => {
    if (!isFormEmpty()) {
      setShowBackConfirmation(true);
    } else {
      navigate('/');
    }
  };

  const cancelBack = () => {
    setShowBackConfirmation(false);
  };

  const confirmBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.aadhar_card.length !== 12) {
      alert('Aadhar Card Number must be exactly 12 digits.');
      return;
    }

    if (formData.phone_no.length !== 10) {
      alert('Phone Number must be exactly 10 digits.');
      return;
    }

    try {
      const dataToSend = {
        full_name: formData.full_name,
        aadhar_card: formData.aadhar_card,
        email: formData.email,
        phone_no: formData.phone_no,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        password: formData.password,
      };

      const data = await request('/citizen/register', {
        body: dataToSend,
        method: 'POST',
      });

      if (data?.success) {
        alert('Registration successful!');
        navigate('/');
      } else {
        alert(data?.message || 'Failed to register.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message || 'An error occurred while submitting the form.');
    }
  };

  return (
    <>
      <ThemeToggle />
      <div className="registration-container">
        <h2>Registration</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', name: 'full_name', type: 'text' },
            { label: 'Aadhar Card No', name: 'aadhar_card', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone No', name: 'phone_no', type: 'text' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'City', name: 'city', type: 'text' },
            { label: 'State', name: 'state', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Re-enter Password', name: 'confirmPassword', type: 'password' },
          ].map((input) => (
            <div key={input.name} className="input-field">
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                value={formData[input.name] || ''}
                onChange={handleChange}
              />
              {input.name === 'confirmPassword' && !passwordMatch && (
                <div className="error-message">Passwords do not match!</div>
              )}
            </div>
          ))}
          <div className="input-field">
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </div>
          <div className="button-container">
            <button type="submit" className="register-button">Register</button>
            <button type="button" onClick={showBackConfirmationPopup} className="back-button">
              Back to Login
            </button>
          </div>
        </form>

        {showBackConfirmation && (
          <div className="registration-back-overlay">
            <div className="registration-back-popup" ref={backConfirmationRef}>
              <div className="registration-back-header">
                <h3>Confirm Navigation</h3>
              </div>
              <div className="registration-back-content">
                <p className="registration-back-message">Your changes will not be saved. Are you sure you want to go back?</p>
                <div className="registration-back-buttons">
                  <button className="registration-back-btn cancel" onClick={cancelBack}>Cancel</button>
                  <button className="registration-back-btn confirm" onClick={confirmBack}>Go Back</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Registration;
