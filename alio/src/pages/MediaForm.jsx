import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- Imported useParams
import { MediaContext } from '../context/MediaContext';

export default function MediaForm() {
  const { mediaItems, addMedia, updateMedia } = useContext(MediaContext); // <-- Grabbed updateMedia
  const navigate = useNavigate();
  
  // 1. Check if there is an ID in the URL
  const { id } = useParams();
  
  // 2. If there is an ID, find the existing item in our RAM database
  const existingItem = id ? mediaItems.find(m => m.id === parseInt(id)) : null;

  // 3. Set the initial state: If existingItem exists, use its data! Otherwise, use blanks.
  const defaultState = {
    title: '', type: 'Movie', year: '', rating: '', review: '', watched: '',
    posterUrl: '', director: '', author: '', duration: '', pages: '', seasons: ''
  };
  
  const [formData, setFormData] = useState(
    existingItem ? { ...defaultState, ...existingItem } : defaultState
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!/^\d{4}$/.test(String(formData.year))) newErrors.year = 'Year must be a 4-digit number.';
    
    const ratingNum = parseInt(formData.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      newErrors.rating = 'Rating must be a number between 1 and 5.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const finalPosterUrl = formData.posterUrl.trim() 
        ? formData.posterUrl 
        : `https://placehold.co/300x450/2b3035/ffffff?text=${encodeURIComponent(formData.title)}`;

      let finalData = {
        ...formData,
        year: parseInt(formData.year),
        rating: parseInt(formData.rating),
        posterUrl: finalPosterUrl,
        // 4. IMPORTANT: If editing, keep the same ID. If creating, make a new Date.now() ID.
        id: existingItem ? existingItem.id : Date.now() 
      };

      if (formData.type === 'Movie') {
        delete finalData.author; delete finalData.pages; delete finalData.seasons;
      } else if (formData.type === 'TV Show') {
        delete finalData.author; delete finalData.pages; delete finalData.duration;
        if (finalData.seasons) finalData.seasons = parseInt(finalData.seasons);
      } else if (formData.type === 'Book') {
        delete finalData.director; delete finalData.duration; delete finalData.seasons;
        if (finalData.pages) finalData.pages = parseInt(finalData.pages);
      }

      // 5. Choose the right action!
      if (existingItem) {
        updateMedia(finalData); // Save over the old one
      } else {
        addMedia(finalData);    // Create a new one
      }

      if (formData.type === 'Book') navigate('/books');
      else if (formData.type === 'TV Show') navigate('/shows');
      else navigate('/movies');
    }
  };

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        {/* Dynamic Title: Changes based on if we are editing or adding */}
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {existingItem ? 'Edit Media' : 'Add to Alio'}
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
              <option value="Book">Book</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
            {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
          </div>

          <div style={twoColStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Release Year</label>
              <input name="year" placeholder="e.g. 1987" value={formData.year} onChange={handleChange} style={inputStyle} />
              {errors.year && <span style={errorTextStyle}>{errors.year}</span>}
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Rating (1-5)</label>
              <input name="rating" type="number" min="1" max="5" value={formData.rating} onChange={handleChange} style={inputStyle} />
              {errors.rating && <span style={errorTextStyle}>{errors.rating}</span>}
            </div>
          </div>

          {formData.type === 'Book' ? (
            <div style={twoColStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Author</label>
                <input name="author" value={formData.author || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Page Count</label>
                <input name="pages" type="number" value={formData.pages || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          ) : (
            <div style={twoColStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Director</label>
                <input name="director" value={formData.director || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                {formData.type === 'Movie' ? (
                  <>
                    <label style={labelStyle}>Duration</label>
                    <input name="duration" placeholder="e.g. 1h 40m" value={formData.duration || ''} onChange={handleChange} style={inputStyle} />
                  </>
                ) : (
                  <>
                    <label style={labelStyle}>Seasons</label>
                    <input name="seasons" type="number" value={formData.seasons || ''} onChange={handleChange} style={inputStyle} />
                  </>
                )}
              </div>
            </div>
          )}

          <div style={twoColStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Date Watched/Read</label>
              <input name="watched" placeholder="DD.MM.YYYY" value={formData.watched || ''} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Poster Image URL</label>
              <input name="posterUrl" placeholder="https://..." value={formData.posterUrl || ''} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Short Review</label>
            <textarea name="review" value={formData.review || ''} onChange={handleChange} style={{...inputStyle, height: '80px', resize: 'none'}} />
          </div>

          <button type="submit" style={submitBtnStyle}>
            {existingItem ? 'Update Alio' : 'Save to Alio'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Inline Styles ---
const pageContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' };
const cardStyle = { backgroundColor: '#343a40', padding: '3rem', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 };
const twoColStyle = { display: 'flex', gap: '1rem' }; 
const labelStyle = { fontSize: '0.9rem', color: '#ccc' };
const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8f9fa', color: '#333', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const errorTextStyle = { color: '#ff6b81', fontSize: '0.8rem', marginTop: '-0.3rem' };
const submitBtnStyle = { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '1rem', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'transform 0.1s' };