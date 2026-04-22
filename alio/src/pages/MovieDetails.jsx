import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function MovieDetails() {
  // 1. Grab the ID from the URL
  const { id } = useParams();
  
  // 2. We use navigate to send the user back to the list after they delete an item
  const navigate = useNavigate();
  
  // 3. Pull the data and the delete function from our RAM Context
  const { mediaItems, deleteMedia } = useContext(MediaContext);

  // 4. Find the exact movie matching this ID (convert URL string to number)
  const item = mediaItems.find(m => m.id === parseInt(id));

  // Safety check: If someone types a bad ID in the URL
  if (!item) {
    return <h2 style={{ color: 'white', textAlign: 'center' }}>Item not found!</h2>;
  }

  // Helper to generate the stars (★)
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // The Delete Action
  const handleDelete = () => {
    // Confirm before deleting (Best Practice!)
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      deleteMedia(item.id);
      // Send them back to the correct category page
      if (item.type === 'Book') navigate('/books');
      else if (item.type === 'TV Show') navigate('/shows');
      else navigate('/movies');
    }
  };

  // --- Visual Rendering (Presentation) ---
  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        
        {/* Left Side: Poster */}
        <div style={imageContainer}>
          <img src={item.posterUrl} alt={item.title} style={posterStyle} />
        </div>

        {/* Right Side: Details */}
        <div style={infoContainer}>
          <h1 style={titleStyle}>{item.title}</h1>
          
          <div style={metaStyle}>
            <p><strong>{item.type === 'Book' ? 'Author' : 'Director'}:</strong> {item.director || item.author}</p>
            <p><strong>Year:</strong> {item.year}</p>
            {item.duration && <p><strong>Duration:</strong> {item.duration}</p>}
            {item.pages && <p><strong>Pages:</strong> {item.pages}</p>}
            {item.seasons && <p><strong>Seasons:</strong> {item.seasons}</p>}
          </div>

          <div style={ratingStyle}>
            <p><strong>Your rating:</strong> {renderStars(item.rating)}/5</p>
            <p><strong>Watched:</strong> {item.watched}</p>
          </div>

          <div style={reviewStyle}>
            {/* We split the review by newlines in case there are multiple paragraphs */}
            <p>{item.review}</p>
          </div>

          {/* Action Buttons */}
          <div style={buttonContainer}>
            {/* We will wire up Edit later */}
            <button style={editBtnStyle}>Edit</button>
            <button onClick={handleDelete} style={deleteBtnStyle}>Delete</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Inline Styles matching Figma ---
const pageContainer = {
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem',
};

const cardStyle = {
  display: 'flex',
  backgroundColor: '#e2e2e2', // Light grey from your design
  color: '#000',
  borderRadius: '40px',
  padding: '3rem',
  maxWidth: '900px',
  width: '100%',
  gap: '3rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};

const imageContainer = {
  flex: '0 0 300px', // Fixed width for poster
};

const posterStyle = {
  width: '100%',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
};

const infoContainer = {
  flex: '1', // Takes up remaining space
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle = {
  fontSize: '3rem',
  margin: '0 0 1.5rem 0',
  fontWeight: 'bold',
};

const metaStyle = {
  fontSize: '1.1rem',
  marginBottom: '2rem',
  lineHeight: '1.8',
};

const ratingStyle = {
  fontSize: '1.1rem',
  marginBottom: '2rem',
  lineHeight: '1.8',
};

const reviewStyle = {
  fontSize: '1rem',
  lineHeight: '1.6',
  marginBottom: 'auto', // Pushes buttons to the bottom
};

const buttonContainer = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  marginTop: '2rem',
};

const btnBase = {
  padding: '0.8rem 2.5rem',
  borderRadius: '25px',
  border: 'none',
  fontSize: '1rem',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const editBtnStyle = {
  ...btnBase,
  backgroundColor: '#ff6b81', // Pink
};

const deleteBtnStyle = {
  ...btnBase,
  backgroundColor: '#ff6b81', // Pink
};