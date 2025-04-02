import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const login = async (username, password) => {
  try {
    const response = await axios.post('/api/login', {
      username: username,
      password: password,
    });
    const data = response.data;
    if (data.ok) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('name', data.name);
      return true;
    } else {
      alert(`Login failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
    return false;
  }
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <header style={{
        backgroundColor: '#282c34', // Darker, modern background
        color: '#61dafb', // Vibrant, contrasting text color (React blue)
        padding: '20px 30px', // Increased padding for a more spacious feel
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Deeper shadow for a more pronounced effect
        borderRadius: '8px', // Rounded corners for a softer look
        fontFamily: 'Arial, sans-serif', // Modern font choice
        fontWeight: '600', // Semi-bold font for emphasis
        fontSize: '1.2em', // Slightly larger font size
        borderBottom: '2px solid #4a5568', // Subtle bottom border for separation
      }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Tractor
        </div>
        <nav className="nav-bar" style={{ width: '100%', textAlign: 'right', padding: '10px 20px', marginBottom: '20px' }}>
          <NavLink
            to="/Register"
            style={{ textDecoration: 'none', color: '#007bff', padding: '10px 15px', border: '1px solid #007bff', borderRadius: '5px' }}
          >
            Register
          </NavLink>
        </nav>
      </header>
      <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>

        <div style={{ width: '300px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h1>
          <form className="login-form">
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Username</label>
            <input
              className="login-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
            <input
              className="login-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </form>
          <div className="login-button" style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                login(username, password).then((success) => {
                  if (success) {
                    alert('Login successful');
                    navigate('/home');
                  }
                });
              }}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;