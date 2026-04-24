import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false); // Controls the hamburger menu

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close the menu automatically if they rotate their phone or resize the window
      if (window.innerWidth >= 768) setMenuOpen(false); 
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={navStyle}>
        {/* LOGO */}
        <Link to="/" style={logoStyle} onClick={closeMenu}>
          ALIO
        </Link>

        {/* DESKTOP LINKS (Hidden on Mobile) */}
        {!isMobile && (
          <div style={desktopLinksStyle}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/movies" style={linkStyle}>Movies</Link>
            <Link to="/books" style={linkStyle}>Books</Link>
            <Link to="/tvshows" style={linkStyle}>TV Shows</Link>
            <button onClick={handleLogout} style={logoutBtnStyle}>Log Out</button>
          </div>
        )}

        {/* MOBILE HAMBURGER BUTTON (Hidden on Desktop) */}
        {isMobile && (
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={hamburgerBtnStyle}
          >
            {/* Toggles between the Hamburger ☰ and the Close X */}
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </nav>

      {/* MOBILE DROPDOWN MENU (Animated with Framer Motion) */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={mobileMenuContainer}
          >
            <div style={mobileLinksWrapper}>
              <Link to="/" style={mobileLinkStyle} onClick={closeMenu}>Home</Link>
              <Link to="/movies" style={mobileLinkStyle} onClick={closeMenu}>Movies</Link>
              <Link to="/books" style={mobileLinkStyle} onClick={closeMenu}>Books</Link>
              <Link to="/tvshows" style={mobileLinkStyle} onClick={closeMenu}>TV Shows</Link>
              <button onClick={handleLogout} style={mobileLogoutBtnStyle}>Log Out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- INLINE STYLES ---

// Base Navbar
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem 3rem',
  backgroundColor: '#2b3035', // Match your dark theme
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  position: 'relative',
  zIndex: 100, // Keeps navbar above the dropdown
};

const logoStyle = {
  fontSize: '2rem',
  fontWeight: '900',
  color: 'white',
  textDecoration: 'none',
  letterSpacing: '2px',
};

// Desktop Styles
const desktopLinksStyle = {
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
};

const linkStyle = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  transition: 'color 0.2s',
};

const logoutBtnStyle = {
  backgroundColor: '#ff6b81',
  color: 'white',
  border: 'none',
  padding: '0.6rem 1.5rem',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

// Mobile Styles
const hamburgerBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ff6b81', // Pink signature color
  fontSize: '2rem',
  cursor: 'pointer',
  padding: 0,
};

const mobileMenuContainer = {
  backgroundColor: '#343a40', // Slightly lighter grey for the dropdown
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
  position: 'absolute',
  width: '100%',
  zIndex: 90,
};

const mobileLinksWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem 0',
  gap: '1.5rem',
};

const mobileLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const mobileLogoutBtnStyle = {
  ...logoutBtnStyle,
  marginTop: '1rem',
  fontSize: '1.2rem',
  padding: '0.8rem 2.5rem',
};