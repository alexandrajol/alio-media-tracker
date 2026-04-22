import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const linkStyle = ({ isActive }) => {
    return {
      padding: '0 1.5rem',
      textDecoration: 'none',
      color: isActive ? '#000000' : '#ffffff',
      backgroundColor: isActive ? '#9e9e9e' : 'transparent',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      // THE FIX: Active links get a height of 75px, inactive stay at 60px
      height: isActive ? '75px' : '60px',
      // Optional: adds a smooth slide effect when clicking different tabs
      transition: 'height 0.2s ease' 
    };
  };

  return (
    <nav style={navContainerStyle}>
      {/* Left Side: Logo */}
      <div style={logoContainerStyle}>
        <Link to="/" style={logoStyle}>
          ALIO
        </Link>
      </div>

      {/* Right Side: Navigation Links */}
      <div style={linksContainerStyle}>
        <NavLink to="/" style={linkStyle}>Home</NavLink>
        <NavLink to="/books" style={linkStyle}>Books</NavLink>
        <NavLink to="/movies" style={linkStyle}>Movies</NavLink>
        <NavLink to="/tvshows" style={linkStyle}>TV Shows</NavLink>
      </div>
    </nav>
  );
}

// --- Inline Styles ---
const navContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  // THE FIX: Changed from 'stretch' to 'flex-start' so the active tab can hang down freely
  alignItems: 'flex-start', 
  height: '60px',
  backgroundColor: '#343a40', 
  padding: '0 2rem',
  // Make sure it sits above the page content when it hangs down
  position: 'relative',
  zIndex: 10,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const logoContainerStyle = {
  height: '60px', // Lock the logo vertically to the original 60px navbar height
  display: 'flex',
  alignItems: 'center',
};

const logoStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '1.5rem',
  letterSpacing: '2px',
};

const linksContainerStyle = {
  display: 'flex',
  // Removed height: '100%' so the children can now dictate their own height
};