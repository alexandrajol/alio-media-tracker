import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mediaItems, deleteMedia } = useContext(MediaContext);

  const item = mediaItems.find(m => m.id === parseInt(id));

  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!item) {
    return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Item not found!</h2>;
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      deleteMedia(item.id);
      if (item.type === 'Book') navigate('/books');
      else if (item.type === 'TV Show') navigate('/shows');
      else navigate('/movies');
    }
  };

  // --- DYNAMIC STYLES ---
  const dynamicCardStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    backgroundColor: '#e2e2e2', 
    color: '#000', 
    borderRadius: '40px', 
    // Shrink the massive padding on mobile so it fits the screen better
    padding: isMobile ? '2rem 1.5rem' : '3rem', 
    maxWidth: '900px', 
    width: '100%', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
  };

  const dynamicTopRowStyle = { 
    display: 'flex', 
    // Stack the poster on top of the text for mobile!
    flexDirection: isMobile ? 'column' : 'row', 
    gap: isMobile ? '2rem' : '3rem', 
    marginBottom: '2rem',
    alignItems: isMobile ? 'center' : 'flex-start',
  };

  const dynamicImageContainer = { 
    // Fix the width on desktop, but let it scale naturally on mobile
    flex: isMobile ? 'auto' : '0 0 250px',
    width: '100%',
    maxWidth: isMobile ? '300px' : 'none', 
  };

  const dynamicInfoContainer = { 
    flex: '1', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    // Center the text layout on mobile
    alignItems: isMobile ? 'center' : 'flex-start',
    textAlign: isMobile ? 'center' : 'left',
  };

  const dynamicTitleStyle = { 
    // Shrink the giant title on mobile so it doesn't break weirdly
    fontSize: isMobile ? '2rem' : '3rem', 
    margin: '0 0 1.5rem 0', 
    fontWeight: '800', 
    lineHeight: '1.1' 
  };

  const dynamicButtonContainer = { 
    display: 'flex', 
    gap: '1rem', 
    // Center buttons on mobile, push to the right on desktop
    justifyContent: isMobile ? 'center' : 'flex-end', 
    marginTop: '1rem' 
  };

  return (
    <div style={pageContainer}>
      <div style={dynamicCardStyle}>
        
        {/* --- TOP ROW: Poster & Metadata --- */}
        <div style={dynamicTopRowStyle}>
          {/* Left Side (or Top on Mobile): Poster */}
          <div style={dynamicImageContainer}>
            <img src={item.posterUrl} alt={item.title} style={posterStyle} />
          </div>

          {/* Right Side (or Bottom on Mobile): Details */}
          <div style={dynamicInfoContainer}>
            <h1 style={dynamicTitleStyle}>{item.title}</h1>
            
            <div style={metaStyle}>
              <p><strong>Genre:</strong> {item.genre || 'Uncategorized'}</p>
              <p><strong>{item.type === 'Book' ? 'Author' : 'Director'}:</strong> {item.director || item.author}</p>
              <p><strong>Year:</strong> {item.year}</p>
              {item.duration && <p><strong>Duration:</strong> {item.duration}</p>}
              {item.pages && <p><strong>Pages:</strong> {item.pages}</p>}
              {item.seasons && <p><strong>Seasons:</strong> {item.seasons}</p>}
            </div>

            <div style={ratingStyle}>
              <p><strong>Your rating:</strong> <span style={{color: '#ff6b81'}}>{renderStars(item.rating)}</span>/5</p>
              <p><strong>Watched:</strong> {item.watched}</p>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: Review & Buttons --- */}
        <div style={bottomRowStyle}>
          <div style={reviewStyle}>
            <h3 style={{...reviewHeaderStyle, textAlign: isMobile ? 'center' : 'left'}}>My Review</h3>
            <p style={{ textAlign: isMobile ? 'center' : 'left' }}>{item.review}</p>
          </div>

          {/* Action Buttons */}
          <div style={dynamicButtonContainer}>
            <button onClick={() => navigate(`/edit/${item.id}`)} style={editBtnStyle}>Edit</button>
            <button onClick={handleDelete} style={deleteBtnStyle}>Delete</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- STATIC INLINE STYLES ---
const pageContainer = { display: 'flex', justifyContent: 'center', padding: '2rem 1rem' };
const bottomRowStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '2px solid #ccc', paddingTop: '2rem' };
const posterStyle = { width: '100%', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', objectFit: 'cover' };

const metaStyle = { fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8', color: '#444' };
const ratingStyle = { fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.6' };
const reviewHeaderStyle = { fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#333' };
const reviewStyle = { fontSize: '1.1rem', lineHeight: '1.8', color: '#222' };

const btnBase = { padding: '0.8rem 2.5rem', borderRadius: '25px', border: 'none', fontSize: '1rem', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle = { ...btnBase, backgroundColor: '#555' }; 
const deleteBtnStyle = { ...btnBase, backgroundColor: '#ff6b81' };