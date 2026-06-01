import React, { useEffect, useState } from 'react';

export default function MediaFilters({ filters, genres, loading, statusLabels = { completed: 'Read', incomplete: 'Unread' }, onChange, onApply, onClear }) {
  const ratingOptions = [1, 2, 3, 4, 5];
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 640;
      setIsMobile(nextIsMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ ...filterPanel, padding: isMobile ? '1rem' : '1.1rem' }}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        style={toggleButton}
        aria-expanded={isOpen}
      >
        <span>Filters</span>
        <span style={toggleMeta}>
          {hasActiveFilters && <span style={activeBadge}>Active</span>}
          <span style={arrowIcon}>{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>

      {!isOpen && hasActiveFilters && (
        <div style={collapsedHint}>Filters are active. Expand to edit or clear them.</div>
      )}

      {isOpen && (
        <>
      <div style={isMobile ? mobileTopRow : topRow}>
        <input
          name="search"
          value={filters.search}
          onChange={onChange}
          placeholder="Search title"
          style={textInput}
        />

        <input
          name="creator"
          value={filters.creator}
          onChange={onChange}
          placeholder="Author or director"
          style={textInput}
        />

        <select name="genre" value={filters.genre} onChange={onChange} style={selectInput}>
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div style={isMobile ? mobileRatingRow : ratingRow}>
        <span style={{ ...labelStyle, width: isMobile ? '100%' : 'auto' }}>Minimum rating</span>
        <button
          type="button"
          onClick={() => onChange({ target: { name: 'minRating', value: '' } })}
          style={{
            ...(isMobile ? mobileChipStyle : chipStyle),
            backgroundColor: filters.minRating === '' ? '#ffffff' : '#495057',
            color: filters.minRating === '' ? '#222' : '#ffffff',
          }}
        >
          Any
        </button>
        {ratingOptions.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange({ target: { name: 'minRating', value: String(rating) } })}
            style={{
              ...(isMobile ? mobileChipStyle : chipStyle),
              backgroundColor: filters.minRating === String(rating) ? '#ff6b81' : '#495057',
            }}
          >
            {rating}+
          </button>
        ))}
      </div>

      <div style={isMobile ? mobileRatingRow : ratingRow}>
        <span style={{ ...labelStyle, width: isMobile ? '100%' : 'auto' }}>Status</span>
        <button
          type="button"
          onClick={() => onChange({ target: { name: 'status', value: '' } })}
          style={{
            ...(isMobile ? mobileChipStyle : chipStyle),
            backgroundColor: filters.status === '' ? '#ffffff' : '#495057',
            color: filters.status === '' ? '#222' : '#ffffff',
          }}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onChange({ target: { name: 'status', value: 'completed' } })}
          style={{
            ...(isMobile ? mobileChipStyle : chipStyle),
            backgroundColor: filters.status === 'completed' ? '#ff6b81' : '#495057',
          }}
        >
          {statusLabels.completed}
        </button>
        <button
          type="button"
          onClick={() => onChange({ target: { name: 'status', value: 'incomplete' } })}
          style={{
            ...(isMobile ? mobileChipStyle : chipStyle),
            backgroundColor: filters.status === 'incomplete' ? '#ff6b81' : '#495057',
          }}
        >
          {statusLabels.incomplete}
        </button>
      </div>

      <div style={isMobile ? mobileBottomRow : bottomRow}>
        <input
          name="yearFrom"
          value={filters.yearFrom}
          onChange={onChange}
          placeholder="From year"
          inputMode="numeric"
          style={isMobile ? mobileInput : yearInput}
        />
        <input
          name="yearTo"
          value={filters.yearTo}
          onChange={onChange}
          placeholder="To year"
          inputMode="numeric"
          style={isMobile ? mobileInput : yearInput}
        />

        <button type="button" onClick={onApply} disabled={loading} style={isMobile ? mobileApplyButton : applyButton}>
          {loading ? 'Filtering...' : 'Apply filters'}
        </button>
        <button type="button" onClick={onClear} disabled={loading} style={isMobile ? mobileClearButton : clearButton}>
          Clear
        </button>
        {hasActiveFilters && <span style={isMobile ? mobileActiveText : activeText}>Filters ready</span>}
      </div>
        </>
      )}
    </div>
  );
}

const filterPanel = {
  width: '100%',
  backgroundColor: '#343a40',
  borderRadius: '16px',
  padding: '1rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  boxSizing: 'border-box',
};

const topRow = {
  display: 'grid',
  gridTemplateColumns: 'minmax(170px, 1fr) minmax(170px, 1fr) minmax(140px, 220px)',
  gap: '0.8rem',
  marginBottom: '1rem',
};

const toggleButton = {
  width: '100%',
  border: 'none',
  backgroundColor: '#2b3035',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '0.85rem 1rem',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const toggleMeta = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
};

const collapsedHint = {
  color: '#ccc',
  fontSize: '0.85rem',
  textAlign: 'center',
};

const activeBadge = {
  color: '#ff6b81',
  fontSize: '0.82rem',
};

const arrowIcon = {
  color: '#ff6b81',
  fontSize: '1rem',
  lineHeight: 1,
};

const mobileTopRow = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const ratingRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
  marginBottom: '1rem',
};

const mobileRatingRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  flexWrap: 'wrap',
  marginBottom: '1rem',
};

const bottomRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  flexWrap: 'wrap',
};

const mobileBottomRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
};

const labelStyle = {
  color: '#ccc',
  fontSize: '0.9rem',
  marginRight: '0.3rem',
};

const inputBase = {
  border: 'none',
  borderRadius: '10px',
  padding: '0.75rem 0.9rem',
  fontSize: '0.95rem',
  backgroundColor: '#f8f9fa',
  color: '#222',
  boxSizing: 'border-box',
};

const textInput = {
  ...inputBase,
  width: '100%',
};

const selectInput = {
  ...inputBase,
  width: '100%',
  cursor: 'pointer',
};

const yearInput = {
  ...inputBase,
  width: '120px',
};

const chipStyle = {
  border: 'none',
  borderRadius: '999px',
  padding: '0.45rem 0.75rem',
  color: '#ffffff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const mobileChipStyle = {
  ...chipStyle,
  minWidth: '44px',
  minHeight: '40px',
  padding: '0.55rem 0.75rem',
};

const applyButton = {
  border: 'none',
  borderRadius: '999px',
  padding: '0.75rem 1.2rem',
  backgroundColor: '#ff6b81',
  color: '#ffffff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const mobileInput = {
  ...inputBase,
  width: '100%',
};

const mobileApplyButton = {
  ...applyButton,
  width: '100%',
  gridColumn: '1 / -1',
  minHeight: '44px',
};

const clearButton = {
  border: '1px solid #777',
  borderRadius: '999px',
  padding: '0.7rem 1rem',
  backgroundColor: 'transparent',
  color: '#ffffff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const mobileClearButton = {
  ...clearButton,
  width: '100%',
  gridColumn: '1 / -1',
  minHeight: '44px',
};

const activeText = {
  color: '#ccc',
  fontSize: '0.85rem',
};

const mobileActiveText = {
  ...activeText,
  gridColumn: '1 / -1',
  textAlign: 'center',
};
