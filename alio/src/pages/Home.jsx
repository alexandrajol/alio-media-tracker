import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Bronze Challenge Mandatory Elements */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '600px' }}>
        {/* Placeholder for your actual LIO logo */}
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', letterSpacing: '2px' }}>/ A L I O \</h1> 
        <h2 style={{ color: '#ff6b81', margin: '0 0 1rem 0', fontStyle: 'italic' }}>
          Track your entertainment universe.
        </h2>
        <p style={{ lineHeight: '1.6', color: '#ccc' }}>
          ALIO is your personal, unified database for tracking the media you consume. 
          Manage your movies, binge-watched TV shows, and reading lists all in one 
          beautifully designed application.
        </p>
      </div>

      {/* Navigation Layout from your Figma Design */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <Link to="/books" style={{...cardStyle, backgroundColor: '#e2e2e2', textDecoration: 'none' }}>
          <h2 style={textRotateStyle}>Books</h2>
        </Link>
        
        <Link to="/movies" style={{...cardStyle, backgroundColor: '#e2e2e2', textDecoration: 'none' }}>
          <h2 style={textRotateStyle}>Movies</h2>
        </Link>
        
        <Link to="/tvshows" style={{...cardStyle, backgroundColor: '#e2e2e2', textDecoration: 'none' }}>
          <h2 style={textRotateStyle}>TV Shows</h2>
        </Link>
      </div>

    </div>
  );
}

// Inline CSS objects to keep things clean and match your Figma
const cardStyle = {
  width: '120px',
  height: '350px',
  backgroundColor: '#d3d3d3',
  borderRadius: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s',
  cursor: 'pointer'
};

const textRotateStyle = {
  writingMode: 'vertical-rl',
  textOrientation: 'mixed',
  transform: 'rotate(180deg)',
  fontSize: '2rem',
  margin: 0
};