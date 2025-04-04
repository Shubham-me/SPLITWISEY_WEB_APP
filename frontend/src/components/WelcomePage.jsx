import React from 'react';
import { NavLink } from 'react-router-dom'; // Correct import for React Router v6

const WelcomePage = () => {
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
            </header>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#f4f4f4',
                    fontFamily: 'sans-serif',
                }}
            >
                <header
                    style={{
                        fontSize: '2.5rem',
                        marginBottom: '2rem',
                        color: '#333',
                    }}
                >
                    Welcome to Tractor
                </header>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <nav
                        style={{
                            display: 'flex',
                            gap: '1rem',
                        }}
                    >
                        <NavLink
                            to="/register"
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '5px',
                                textDecoration: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s ease',
                            }}
                            activeStyle={{ backgroundColor: '#0056b3' }} // Optional active style
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                        >
                            Register
                        </NavLink>
                        <NavLink
                            to="/login"
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '5px',
                                textDecoration: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s ease',
                            }}
                            activeStyle={{ backgroundColor: '#0056b3' }} // Optional active style
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                        >
                            Login
                        </NavLink>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;