import React from 'react';
import { NavLink } from 'react-router-dom'; // Correct import for React Router v6

const WelcomePage = () => {
    return (
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
    );
};

export default WelcomePage;