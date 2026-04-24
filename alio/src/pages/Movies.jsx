import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';
import MediaStats from '../components/MediaStats';

export default function Movies() {
  const { mediaItems } = useContext(MediaContext);
  const navigate = useNavigate();

  const movies = mediaItems.filter(item => item.type === 'Movie');

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; 
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- RESPONSIVE STATE ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoints for tablets and phones
  const isMobile = windowWidth < 960;
  const isTinyScreen = windowWidth < 500;

  // --- DYNAMIC STYLES ---
  const dynamicSplitLayout = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row', // Stack on small screens!
    gap: '3rem',
    alignItems: isMobile ? 'center' : 'flex-start',
  };

  const dynamicRightColumn = {
    flex: '1',
    width: '100%',
    position: isMobile ? 'static' : 'sticky', // Un-stick the stats on mobile
    top: '100px',
  };

  const dynamicGridStyle = {
    display: 'grid',
    // 3 columns on desktop, 2 on tablets, 1 on tiny phones
    gridTemplateColumns: isTinyScreen ? 'repeat(1, 1fr)' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
    gap: '2rem',
    width: '100%',
    marginBottom: '3rem',
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button onClick={() => navigate('/add')} style={addBtnStyle}>Add a new Movie</button>
      </div>

      <div style={dynamicSplitLayout}>
        {/* LEFT COLUMN: The Master Grid */}
        <div style={leftColumn}>
          <div style={dynamicGridStyle}>
            {currentMovies.map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id} style={cardStyle}>
                <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
              </Link>
            ))}
          </div>

          {totalPages > 0 && (
            <div style={paginationStyle}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    ...pageBtnStyle,
                    backgroundColor: currentPage === pageNum ? '#ffffff' : '#e0e0e0',
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: The Interactive Statistics */}
        <div style={dynamicRightColumn}>
          <MediaStats data={movies} type="Movie" /> 
        </div>
      </div>
    </div>
  );
}

// --- STATIC INLINE STYLES ---
const pageContainer = { padding: '2rem', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' };
const addBtnStyle = { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '20px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };
const leftColumn = { flex: '2', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }; 
const cardStyle = { display: 'block', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none' };
const posterStyle = { width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0,0,0,0.4)', objectFit: 'cover' };
const paginationStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' };
const pageBtnStyle = { width: '40px', height: '40px', borderRadius: '50%', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };