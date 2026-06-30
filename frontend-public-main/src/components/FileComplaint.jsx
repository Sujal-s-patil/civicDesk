import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/FileComplaint.css';
import { request } from '../utils/api.js';
import ThemeToggle from './ThemeToggle.jsx';

const FileComplaint = () => {
  const navigate = useNavigate();
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const backConfirmationRef = useRef(null);
  const [complaintData, setComplaintData] = useState({
    crime_type: '',
    crime_description: '',
    crime_location: '',
    city: '',
    state: '',
    crime_date: '',
  });

  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (backConfirmationRef.current && !backConfirmationRef.current.contains(event.target) && !event.target.closest('.back-dashboard-button')) {
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

  const showBackConfirmationPopup = () => {
    setShowBackConfirmation(true);
  };

  const cancelBack = () => {
    setShowBackConfirmation(false);
  };

  const confirmBack = () => {
    navigate('/home');
  };

  const validateForm = () => {
    const errors = {};

    if (!complaintData.crime_type.trim()) {
      errors.crime_type = 'Crime type is required';
    }

    if (!complaintData.crime_description.trim()) {
      errors.crime_description = 'Crime description is required';
    } else if (complaintData.crime_description.length < 20) {
      errors.crime_description = 'Description must be at least 20 characters';
    }

    if (!complaintData.crime_location.trim()) {
      errors.crime_location = 'Crime location is required';
    }

    if (!complaintData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!complaintData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!complaintData.crime_date) {
      errors.crime_date = 'Crime date is required';
    } else {
      const selectedDate = new Date(complaintData.crime_date);
      const today = new Date();

      if (selectedDate > today) {
        errors.crime_date = 'Crime date cannot be in the future';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files: selectedFiles } = e.target;
    if (name === 'file') {
      setFiles(Array.from(selectedFiles || []));
      setFileName(selectedFiles?.length > 0 ? `${selectedFiles.length} files selected` : '');
      return;
    }

    setComplaintData((current) => ({ ...current, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((current) => ({ ...current, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        crime_type: complaintData.crime_type,
        crime_description: complaintData.crime_description,
        crime_location: complaintData.crime_location,
        city: complaintData.city,
        state: complaintData.state,
        crime_date: complaintData.crime_date,
      };

      const response = await request('/complaint/create', {
        method: 'POST',
        body: payload,
      });

      if (!response?.id) {
        throw new Error('Failed to file complaint. Please try again.');
      }

      if (files.length > 0) {
        const formData = new FormData();
        formData.append('complaint_id', String(response.id));
        files.forEach((file) => formData.append('photos', file));

        await request('/complaint/evidence', {
          method: 'POST',
          body: formData,
        });
      }

      setSuccessMessage('Your complaint has been successfully filed!');
      setComplaintData({
        crime_type: '',
        crime_description: '',
        crime_location: '',
        city: '',
        state: '',
        crime_date: '',
      });
      setFiles([]);
      setFileName('');

      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } catch (err) {
      console.error('Error filing complaint:', err);
      setError(err.message || 'An error occurred while filing the complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formInputs = [
    {
      label: 'Crime Type',
      name: 'crime_type',
      type: 'text',
      placeholder: 'e.g., Theft, Assault, Fraud',
    },
    {
      label: 'Crime Description',
      name: 'crime_description',
      type: 'textarea',
      placeholder: 'Provide detailed information about the crime (minimum 20 characters)',
    },
    {
      label: 'Crime Location',
      name: 'crime_location',
      type: 'text',
      placeholder: 'Specific location where the crime occurred',
    },
    {
      label: 'City',
      name: 'city',
      type: 'text',
      placeholder: 'Enter city name',
    },
    {
      label: 'State',
      name: 'state',
      type: 'text',
      placeholder: 'Enter state name',
    },
    {
      label: 'Crime Date',
      name: 'crime_date',
      type: 'date',
      placeholder: 'Select the date when the crime occurred',
    },
  ];

  return (
    <>
      <ThemeToggle />
      <UserNav />
      <div className="form-container">
        <h2>File a Complaint</h2>
        <p className="form-description">
          Please fill out the form below to file your complaint. All fields marked with an asterisk (*) are required.
        </p>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="complaint-form">
            {formInputs.map((input) => (
              <div key={input.name} className="form-group">
                <label htmlFor={input.name}>
                  {input.label} <span className="required">*</span>
                </label>
                <div className="input-cell">
                  {input.type === 'textarea' ? (
                    <textarea
                      name={input.name}
                      value={complaintData[input.name] || ''}
                      onChange={handleChange}
                      required
                      id={input.name}
                      placeholder={input.placeholder}
                      className={validationErrors[input.name] ? 'error' : ''}
                    />
                  ) : (
                    <input
                      type={input.type}
                      name={input.name}
                      value={complaintData[input.name] || ''}
                      onChange={handleChange}
                      required
                      id={input.name}
                      placeholder={input.placeholder}
                      className={validationErrors[input.name] ? 'error' : ''}
                    />
                  )}
                  {validationErrors[input.name] && <div className="field-error">{validationErrors[input.name]}</div>}
                </div>
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="file">Upload Proof (optional)</label>
              <div className="input-cell">
                <div className="file-upload-container">
                  <label className="file-upload-label" htmlFor="file">
                    <span>📁</span> Choose a file
                  </label>
                  <input type="file" name="file" onChange={handleChange} id="file" multiple />
                  {fileName && <div className="file-name">Selected: {fileName}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button type="button" className="back-dashboard-button" onClick={showBackConfirmationPopup}>
              Back to Dashboard
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>

        {showBackConfirmation && (
          <div className="complaint-back-overlay">
            <div className="complaint-back-popup" ref={backConfirmationRef}>
              <div className="complaint-back-header">
                <h3>Confirm Navigation</h3>
              </div>
              <div className="complaint-back-content">
                <p className="complaint-back-message">Your changes will not be saved. Are you sure you want to go back?</p>
                <div className="complaint-back-buttons">
                  <button className="complaint-back-btn cancel" onClick={cancelBack}>Cancel</button>
                  <button className="complaint-back-btn confirm" onClick={confirmBack}>Go Back</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileComplaint;
