import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

async function register(name, username, password) {
  return axios
    .post('/api/register', {
      name: name,
      username: username,
      password: password,
    })
    .then((response) => response.data)
    .then((data) => {
      if (data.ok) {
        alert('Registration successful');
        return true;
      } else {
        alert('Registration failed: ' + data.message);
        return false;
      }
    });
}

const RegisterPage = () => {
  const [name, setName] = useState('');
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
        <nav style={{ width: '100%', textAlign: 'right', padding: '20px' }}>
          <NavLink to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', padding: '10px 15px', border: '1px solid #007bff', borderRadius: '5px' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#007bff'; }}
          >
            Login
          </NavLink>
        </nav>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4', fontFamily: 'sans-serif' }}>

        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '350px' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Register</h1>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>

          </form>
          <button
            type="button"
            onClick={() => {
              register(name, username, password)
                .then((success) => {
                  if (success) {
                    navigate('/login');
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
            style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#0056b3'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; }}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;