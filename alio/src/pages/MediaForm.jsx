import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function MediaForm() {
  const { addMedia } = useContext(MediaContext);
  const navigate = useNavigate();

  // 1. Local State for Form Inputs
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie', // Default to Movie
    year: '',
    rating: '',
    review: '',
    posterUrl: ''
  });

  // Local State for Validation Errors
  const [errors, setErrors] = useState({});

  // 2. Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for a field once the user starts typing
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  // 3. MANDATORY DATA VALIDATION LOGIC
  const validateForm = () => {
    let newErrors = {};
    
    // Rule 1: Title cannot be empty
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    
    // Rule 2: Year must be exactly 4 digits
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(formData.year)) {
      newErrors.year = 'Year must be a valid 4-digit number.';
    }

    // Rule 3: Rating must be between 1 and 5
    const ratingNum = parseInt(formData.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      newErrors.rating = 'Rating must be a number between 1 and 5.';
    }

    setErrors(newErrors);
    
    // If the errors object is empty, the form is valid!
    return Object.keys(newErrors).length === 0;
  };

  // 4. Handle Submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    if (validateForm()) {
      // If no poster is provided, generate a placeholder with the title
      const finalPosterUrl = formData.posterUrl.trim() 
        ? formData.posterUrl 
        : `https://placehold.co/300x450/2b3035/ffffff?text=${encodeURIComponent(formData.title)}`;

      // Add to RAM Context
      addMedia({
        ...formData,
        year: parseInt(formData.year),
        rating: parseInt(formData.rating),
        posterUrl: finalPosterUrl
      });

      // Route the user back to the correct category page
      if (formData.type === 'Book') navigate('/books');
      else if (formData.type === 'TV Show') navigate('/shows');
      else navigate('/movies');
    }
  };

  // --- Visual Rendering (Presentation matching your Figma Login screen) ---
  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add New Media</h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* Title Field */}
          <div style={inputGroup}>
            <label style={labelStyle}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
            {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
          </div>

          {/* Type Dropdown */}
          <div style={inputGroup}>
            <label style={labelStyle}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
              <option value="Book">Book</option>
            </select>
          </div>

          {/* Year Field */}
          <div style={inputGroup}>
            <label style={labelStyle}>Release Year</label>
            <input name="year" placeholder="e.g. 1987" value={formData.year} onChange={handleChange} style={inputStyle} />
            {errors.year && <span style={errorTextStyle}>{errors.year}</span>}
          </div>

          {/* Rating Field */}
          <div style={inputGroup}>
            <label style={labelStyle}>Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" value={formData.rating} onChange={handleChange} style={inputStyle} />
            {errors.rating && <span style={errorTextStyle}>{errors.rating}</span>}
          </div>

          {/* Review Field */}
          <div style={inputGroup}>
            <label style={labelStyle}>Short Review</label>
            <textarea name="review" value={formData.review} onChange={handleChange} style={{...inputStyle, height: '80px', resize: 'none'}} />
          </div>

          <button type="submit" style={submitBtnStyle}>Save to Alio</button>
        </form>
      </div>
    </div>
  );
}

// --- Inline Styles ---
const pageContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
};

const cardStyle = {
  backgroundColor: '#343a40', // Dark grey matching your auth cards
  padding: '3rem',
  borderRadius: '20px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 0 40px rgba(0,0,0,0.5)', // Glow effect from your design
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyle = {
  fontSize: '0.9rem',
  color: '#ccc',
};

const inputStyle = {
  padding: '0.8rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#f8f9fa',
  color: '#333',
  fontSize: '1rem',
};

const errorTextStyle = {
  color: '#ff6b81', // Pink error text
  fontSize: '0.8rem',
  marginTop: '-0.3rem',
};

const submitBtnStyle = {
  backgroundColor: '#ff6b81', // Your signature pink
  color: 'white',
  border: 'none',
  padding: '1rem',
  borderRadius: '25px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'transform 0.1s',
};