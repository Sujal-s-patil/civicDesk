import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { request } from '../utils/api.js';
import { setStoredUser } from '../utils/auth.js';
import ThemeToggle from './ThemeToggle.jsx';

const Login = () => {
  const [aadharCardNo, setAadharCardNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      aadhar_card: aadharCardNo,
      password,
    };

    try {
      const data = await request('/citizen/login', {
        body: loginData,
        method: 'POST',
      });

      if (data?.success) {
        setStoredUser(data.data);
        navigate('/home');
      } else {
        setErrorMessage(data?.message || 'Login failed');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.message || 'An error occurred while trying to log in.');
      setPassword('');
    }
  };

  return (
    <>
      <ThemeToggle />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={aadharCardNo}
              onChange={(e) => setAadharCardNo(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="Aadhar Card Number"
              autoComplete="off"
              maxLength="12"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="off"
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate('/register')}>
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
