import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mediaItems, deleteMedia } = useContext(MediaContext);

  const item = mediaItems.find(m => m.id === parseInt(id));

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

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        
        {/* --- TOP ROW: Poster & Metadata --- */}
        <div style={topRowStyle}>
          {/* Left Side: Poster */}
          <div style={imageContainer}>
            <img src={item.posterUrl} alt={item.title} style={posterStyle} />
          </div>

          {/* Right Side: Details */}
          <div style={infoContainer}>
            <h1 style={titleStyle}>{item.title}</h1>
            
            <div style={metaStyle}>
              {/* Added Genre right at the top of the metadata! */}
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
            <h3 style={reviewHeaderStyle}>My Review</h3>
            <p>{item.review}</p>
          </div>

          {/* Action Buttons */}
          <div style={buttonContainer}>
            <button onClick={() => navigate(`/edit/${item.id}`)} style={editBtnStyle}>Edit</button>
            <button onClick={handleDelete} style={deleteBtnStyle}>Delete</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Inline Styles ---
const pageContainer = { display: 'flex', justifyContent: 'center', padding: '2rem' };
const cardStyle = { 
  display: 'flex', 
  flexDirection: 'column', // Changed to column so top and bottom stack
  backgroundColor: '#e2e2e2', 
  color: '#000', 
  borderRadius: '40px', 
  padding: '3rem', 
  maxWidth: '900px', 
  width: '100%', 
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
};

// Layout Containers
const topRowStyle = { display: 'flex', gap: '3rem', marginBottom: '2rem' };
const bottomRowStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '1.5rem', 
  borderTop: '2px solid #ccc', // Adds a nice subtle separator line
  paddingTop: '2rem' 
};

const imageContainer = { flex: '0 0 250px' }; // Made the poster slightly narrower
const posterStyle = { width: '100%', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', objectFit: 'cover' };
const infoContainer = { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' };

// Text Styles
const titleStyle = { fontSize: '3rem', margin: '0 0 1.5rem 0', fontWeight: '800', lineHeight: '1.1' };
const metaStyle = { fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8', color: '#444' };
const ratingStyle = { fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.6' };

const reviewHeaderStyle = { fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#333' };
const reviewStyle = { fontSize: '1.1rem', lineHeight: '1.8', color: '#222' };

// Buttons
const buttonContainer = { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' };
const btnBase = { padding: '0.8rem 2.5rem', borderRadius: '25px', border: 'none', fontSize: '1rem', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle = { ...btnBase, backgroundColor: '#555' }; // Changed edit to dark grey for contrast
const deleteBtnStyle = { ...btnBase, backgroundColor: '#ff6b81' };