import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaContext } from '../context/MediaContext';
import MediaStats from '../components/MediaStats';

export default function Books() {
  const { mediaItems } = useContext(MediaContext);
  const navigate = useNavigate();

  const books = mediaItems.filter(item => item.type === 'Book');

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; 
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <button onClick={() => navigate('/add')} style={addBtnStyle}>Add a new Book</button>
      </div>

      <div style={splitLayout}>
        {/* LEFT COLUMN: The Master Grid */}
        <div style={leftColumn}>
          <div style={gridStyle}>
            {currentBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} style={cardStyle}>
                <img src={book.posterUrl} alt={book.title} style={posterStyle} />
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
        <div style={rightColumn}>
          <MediaStats data={books} type="Book" /> 
        </div>
      </div>
    </div>
  );
}

// --- Inline Styles ---
const pageContainer = { padding: '2rem', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' };
const addBtnStyle = { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '20px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };
const splitLayout = { display: 'flex', gap: '3rem', alignItems: 'flex-start' };
const leftColumn = { flex: '2', display: 'flex', flexDirection: 'column', alignItems: 'center' }; 
const rightColumn = { flex: '1', position: 'sticky', top: '100px' }; 
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', marginBottom: '3rem' };
const cardStyle = { display: 'block', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none' };
const posterStyle = { width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0,0,0,0.4)', objectFit: 'cover' };
const paginationStyle = { display: 'flex', gap: '1rem', justifyContent: 'center' };
const pageBtnStyle = { width: '40px', height: '40px', borderRadius: '50%', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };