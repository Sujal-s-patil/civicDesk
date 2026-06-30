import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/Complaints.css';
import { request } from '../utils/api.js';
import ThemeToggle from './ThemeToggle.jsx';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState(null);
  const [proofLinks, setProofLinks] = useState([]);
  const [isProofPopupVisible, setIsProofPopupVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await request('/complaint/mine');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'An error occurred while fetching complaints.');
    }
  };

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closePopup = () => {
    setSelectedComplaint(null);
  };

  const fetchProofLinks = async (complaintId) => {
    try {
      const data = await request(`/complaint/${complaintId}/evidence`);
      setProofLinks(Array.isArray(data) ? data : []);
      setIsProofPopupVisible(true);
    } catch (err) {
      console.error('Error fetching proof links:', err);
    }
  };

  const closeProofPopup = () => {
    setIsProofPopupVisible(false);
    setProofLinks([]);
  };

  return (
    <>
      <ThemeToggle />
      <UserNav />
      <div className="complaints-container">
        <h2>Your Complaints</h2>
        {error && <p className="error-message">{error}</p>}
        {complaints.length > 0 ? (
          <>
            <div className="table-scrollable">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Crime Type</th>
                    <th>Crime Location</th>
                    <th>Date Filed</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} onClick={() => handleRowClick(complaint)}>
                      <td>
                        <span className="table-icon status-icon">
                          {complaint.status?.toLowerCase() === 'resolved' && <span className="tick"></span>}
                          {complaint.status?.toLowerCase() === 'in progress' && <span className="spinner"></span>}
                          {complaint.status?.toLowerCase() === 'pending' && <span className="pending-icon"></span>}
                          {complaint.status?.toLowerCase() === 'closed' && <span className="dash-circle"></span>}
                        </span>
                        {complaint.status}
                      </td>
                      <td>{complaint.crime_type}</td>
                      <td>{complaint.crime_location}</td>
                      <td>{complaint.crime_date ? new Date(complaint.crime_date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="button-container">
              <button className="back-btn" onClick={() => navigate('/home')}>
                Back to Dashboard
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="no-complaints">No complaints found.</p>
            <div className="button-container">
              <button className="back-btn" onClick={() => navigate('/home')}>
                Back to Dashboard
              </button>
            </div>
          </>
        )}

        {selectedComplaint && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h3>Complaint Details</h3>
                <button className="modern-close-btn" onClick={closePopup}>
                  ✖
                </button>
              </div>
              <div className="popup-content">
                <table className="popup-table">
                  <tbody>
                    <tr>
                      <th>Complainant</th>
                      <td>{selectedComplaint.complainant_name}</td>
                      <th>Status</th>
                      <td>{selectedComplaint.status}</td>
                    </tr>
                    <tr>
                      <th>Crime Type</th>
                      <td>{selectedComplaint.crime_type}</td>
                      <th>Crime Date</th>
                      <td>{selectedComplaint.crime_date ? new Date(selectedComplaint.crime_date).toLocaleDateString() : '—'}</td>
                    </tr>
                    <tr>
                      <th>Crime Location</th>
                      <td>{selectedComplaint.crime_location}</td>
                      <th>City</th>
                      <td>{selectedComplaint.city}</td>
                    </tr>
                    <tr>
                      <th>State</th>
                      <td>{selectedComplaint.state}</td>
                      <th>Filed On</th>
                      <td>{selectedComplaint.created_at ? new Date(selectedComplaint.created_at).toLocaleString() : '—'}</td>
                    </tr>
                    <tr className="full-width-row">
                      <th>Crime Description</th>
                      <td colSpan="3">{selectedComplaint.crime_description || 'No description provided.'}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="proof-section">
                  <p><strong>Uploaded Proof:</strong></p>
                  <button className="download-link" onClick={() => fetchProofLinks(selectedComplaint.id)}>
                    Download Proof
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isProofPopupVisible && (
          <div className="popup-overlay" onClick={closeProofPopup}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h3>Proof Files</h3>
                <button className="modern-close-btn" onClick={closeProofPopup}>
                  ✖
                </button>
              </div>
              <div className="popup-content">
                {proofLinks.length > 0 ? (
                  <div className="proof-grid">
                    {proofLinks
                      .sort((a, b) => {
                        const getTypePriority = (file) => {
                          const extension = file.link.split('.').pop().toLowerCase();
                          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 1;
                          if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(extension)) return 2;
                          return 3;
                        };
                        return getTypePriority(a) - getTypePriority(b);
                      })
                      .reduce((acc, file) => {
                        const fileExtension = file.link.split('.').pop().toLowerCase();
                        let type = '';
                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                          type = 'Image File';
                        } else if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(fileExtension)) {
                          type = 'Video File';
                        } else if (fileExtension === 'pdf') {
                          type = 'PDF File';
                        } else if (['doc', 'docx'].includes(fileExtension)) {
                          type = 'Word File';
                        } else {
                          type = `${fileExtension.toUpperCase()} File`;
                        }
                        acc.push({ ...file, type });
                        return acc;
                      }, [])
                      .map((file, index, array) => {
                        const typeCount = array.filter((f) => f.type === file.type).indexOf(file) + 1;
                        if (file.type === 'Image File') {
                          return (
                            <div key={index} className="proof-item">
                              <img src={file.link} alt={`Proof ${index + 1}`} className="proof-image" onClick={() => window.open(file.link, '_blank')} />
                            </div>
                          );
                        }

                        return (
                          <div key={index} className="proof-item">
                            <a href={file.link} target="_blank" rel="noopener noreferrer" download>
                              {`${file.type} ${typeCount}`}
                            </a>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p>No proof files available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Complaints;