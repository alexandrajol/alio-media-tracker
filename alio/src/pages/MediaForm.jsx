import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';

export default function MediaForm() {
  const { mediaItems, addMedia, updateMedia } = useContext(MediaContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const existingItem = id ? mediaItems.find(m => m.id === parseInt(id)) : null;

  const defaultState = {
    title: '', type: 'Movie', genre: '', year: '', rating: '', review: '', watched: '',
    posterUrl: '', director: '', author: '', duration: '', pages: '', seasons: ''
  };
  
  const [formData, setFormData] = useState(
    existingItem ? { ...defaultState, ...existingItem } : defaultState
  );

  const [errors, setErrors] = useState({});

  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    // Date Watched Validation (DD.MM.YYYY)
    if (formData.watched && formData.watched.trim() !== '') {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4}$/;
      if (!dateRegex.test(formData.watched)) {
        newErrors.watched = 'Must be a valid date (DD.MM.YYYY).';
      }
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

      if (existingItem) updateMedia(finalData);
      else addMedia(finalData);

      if (formData.type === 'Book') navigate('/books');
      else if (formData.type === 'TV Show') navigate('/tvshows');
      else navigate('/movies');
    }
  };

  // --- DYNAMIC STYLES ---
  const dynamicCardStyle = {
    backgroundColor: '#343a40', 
    padding: isMobile ? '2rem 1.5rem' : '3rem', // Less padding on mobile edges
    borderRadius: '20px', 
    width: '100%', 
    maxWidth: '600px', 
    boxShadow: '0 0 40px rgba(0,0,0,0.5)',
  };

  const dynamicTwoColStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row', // Stack vertically on phones!
    gap: '1rem',
  };

  return (
    <div style={pageContainer}>
      <div style={dynamicCardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {existingItem ? 'Edit Media' : 'Add to Alio'}
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={dynamicTwoColStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
                <option value="Book">Book</option>
              </select>
            </div>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Genre</label>
              <input name="genre" placeholder="e.g. Comedy" value={formData.genre} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
            {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
          </div>

          <div style={dynamicTwoColStyle}>
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
            <div style={dynamicTwoColStyle}>
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
            <div style={dynamicTwoColStyle}>
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

          <div style={dynamicTwoColStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Date Watched/Read</label>
              <input name="watched" placeholder="DD.MM.YYYY" value={formData.watched || ''} onChange={handleChange} style={inputStyle} />
              {errors.watched && <span style={errorTextStyle}>{errors.watched}</span>}
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

// --- STATIC INLINE STYLES ---
const pageContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 1rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 };
const labelStyle = { fontSize: '0.9rem', color: '#ccc' };
const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8f9fa', color: '#333', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const errorTextStyle = { color: '#ff6b81', fontSize: '0.8rem', marginTop: '-0.3rem' };
const submitBtnStyle = { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '1rem', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'transform 0.1s' };