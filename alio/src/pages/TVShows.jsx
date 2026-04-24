import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function TVShows() {
  // 1. Pull the data from your RAM State
  const { mediaItems } = useContext(MediaContext);

  const navigate = useNavigate();

  // Filter to ensure we only show movies on this page
  const tvshows = mediaItems.filter(item => item.type === 'TV Show');

  // --- 2. Pagination Logic (Implementation Details) ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; // Matches your 3x3 Figma design

  const totalPages = Math.ceil(tvshows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // This slices the array so we only show 9 items at a time
  const currentTVShows = tvshows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- 3. Visual Rendering (Presentation) ---
  return (
    <div style={containerStyle}>
      {/* Top Bar with Add Button */}
      <div style={headerStyle}>
        <button onClick={() => navigate('/add')} style={addBtnStyle}>
            Add a new TV Show
        </button>
        
      </div>

      {/* The Master View: Grid of Posters */}
      <div style={gridStyle}>
        {currentTVShows.map((tvshow) => (
          // Link wraps the poster to prepare for your Detail View routing!
          <Link to={`/tvshows/${tvshow.id}`} key={tvshow.id} style={cardStyle}>
            <img 
              src={tvshow.posterUrl} 
              alt={tvshow.title} 
              style={posterStyle} 
            />
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div style={paginationStyle}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              style={{
                ...pageBtnStyle,
                backgroundColor: currentPage === pageNum ? '#ffffff' : '#e0e0e0', // Highlight active page
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Inline Styles matching Figma ---
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '3rem',
};

const addBtnStyle = {
  backgroundColor: '#ff6b81', // Matching your pink button
  color: 'white',
  border: 'none',
  padding: '0.8rem 2rem',
  borderRadius: '20px',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '3rem',
  marginBottom: '4rem',
  width: '100%',
};

const cardStyle = {
  display: 'block',
  transition: 'transform 0.2s', // Hover effect
  cursor: 'pointer',
  textDecoration: 'none',
};

const posterStyle = {
  width: '100%',
  height: 'auto',
  aspectRatio: '2 / 3', // Keeps standard movie poster dimensions
  borderRadius: '15px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
  objectFit: 'cover',
};

const paginationStyle = {
  display: 'flex',
  gap: '1rem',
};

const pageBtnStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%', // Perfect circles like your design
  border: 'none',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#333',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};