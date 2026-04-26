import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';


const OPTIONS = [
  { id: 'books', title: 'Books', sub: 'Track your reading universe', icon: 'B', bg: 'https://images.unsplash.com/photo-1472173148041-00294f0814a2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlicmFyeSUyMGFlc3RoZXRpY3xlbnwwfHwwfHx8MA%3D%3D?q=80&w=800&auto=format&fit=crop' },
  { id: 'tvshows', title: 'TV Shows', sub: 'Binge-watch tracking', icon: 'T', bg: 'https://t3.ftcdn.net/jpg/04/68/31/16/360_F_468311607_z6Yu6bN0hHH0OtujaXnoXfCeP8BjK1f2.jpg?q=80&w=800&auto=format&fit=crop' },
  { id: 'movies', title: 'Movies', sub: 'Your personal cinema', icon: 'M', bg: 'https://turismistoric.ro/wp-content/uploads/2019/03/Cinema-film.jpg?q=80&w=800&auto=format&fit=crop' }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState('movies');
  
  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listens for screen size changes (like rotating a phone or resizing a browser window)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={pageContainer}>
      
      {/* Title Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={titleContainer}
      >
        {/* Slightly smaller logo on mobile */}
        <h1 style={{...logoStyle, fontSize: isMobile ? '3rem' : '4rem'}}>ALIO</h1> 
        <h2 style={{...taglineStyle, fontSize: isMobile ? '1rem' : '1.2rem'}}>Track your entertainment universe.</h2>
      </motion.div>

      {/* THE ACCORDION FLEX CARDS */}
      <div style={{
        ...accordionContainer,
        // MAGIC: Stack vertically on phones, horizontally on laptops
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? '600px' : '400px', 
      }}>
        {OPTIONS.map((option) => {
          const isActive = activeCard === option.id;

          return (
            <motion.div
              key={option.id}
              // Hover for desktop, Tap for mobile!
              onHoverStart={() => !isMobile && setActiveCard(option.id)}
              onTap={() => {
                if (isMobile) setActiveCard(option.id);
                navigate(`/${option.id}`); // Double tap to navigate
              }}
              onClick={() => !isMobile && navigate(`/${option.id}`)}
              animate={{
                flexGrow: isActive ? 10 : 1,
                // On mobile, separate with top/bottom margin. On desktop, left/right margin.
                margin: isActive ? '0px' : (isMobile ? '10px 0px' : '0px 10px'),
                borderRadius: isActive ? '40px' : '30px',
                
                // On mobile, width is always 100%, and we animate the HEIGHT. 
                // On desktop, height is always 100%, and we animate the WIDTH.
                minWidth: isMobile ? '100%' : (isActive ? '300px' : '60px'),
                minHeight: isMobile ? (isActive ? '300px' : '80px') : '100%',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{
                ...cardStyle,
                backgroundImage: `url(${option.bg})`,
              }}
            >
              <div style={shadowOverlay} />

              <motion.div 
                animate={{
                  bottom: isActive ? '20px' : '10px',
                  left: isActive ? '20px' : '10px',
                }}
                style={labelContainer}
              >
                <div style={iconCircle}>{option.icon}</div>
                
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{...infoContainer, display: isActive ? 'flex' : 'none'}}
                >
                  <div style={mainTextStyle}>{option.title}</div>
                  <div style={subTextStyle}>{option.sub}</div>
                </motion.div>
              </motion.div>

            </motion.div>
          );
        })}
      </div>

      {/* --- TELEMETRY DISPLAY --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: '4rem', padding: '1.5rem 2rem', backgroundColor: '#2b3035',
          borderRadius: '20px', color: '#ccc', textAlign: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '1px solid #444'
        }}
      >
        <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>Alio Telemetry Data</h3>
        
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>Total Interactions:</strong>{' '}
          <span style={{ color: '#ff6b81', fontWeight: 'bold' }}>
            {Cookies.get('alio_total_clicks') || 1}
          </span>
        </p>

        <p style={{ margin: 0 }}>
          <strong>Preferred Media:</strong>{' '}
          <span style={{ color: '#ff6b81', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {(() => {
              const rawPrefs = Cookies.get('alio_preferences');
              if (!rawPrefs) return 'Exploring...';
              
              const prefs = JSON.parse(rawPrefs);
              // Finds the category with the highest score
              const favorite = Object.keys(prefs).reduce((a, b) => prefs[a] > prefs[b] ? a : b);
              
              return prefs[favorite] === 0 ? 'Exploring...' : (favorite === 'tvshow' ? 'TV Shows' : favorite);
            })()}
          </span>
        </p>
      </motion.div>

    </div>
  );
}

// --- Inline CSS Objects ---
const pageContainer = { padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' };
const titleContainer = { textAlign: 'center', marginBottom: '3rem' };
const logoStyle = { margin: '0 0 0.5rem 0', letterSpacing: '4px', fontWeight: '900', color: 'white' };
const taglineStyle = { color: '#ff6b81', margin: 0, fontStyle: 'italic' };

const accordionContainer = {
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '900px',
};

const cardStyle = {
  position: 'relative',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  cursor: 'pointer',
  display: 'flex',
};

const shadowOverlay = {
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  height: '120px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
};

const labelContainer = {
  display: 'flex',
  position: 'absolute',
  height: '40px',
  alignItems: 'center',
};

const iconCircle = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minWidth: '40px', maxWidth: '40px', height: '40px',
  borderRadius: '50%', backgroundColor: 'white', color: '#333', fontSize: '1.2rem',
};

const infoContainer = {
  flexDirection: 'column', justifyContent: 'center', marginLeft: '15px', color: 'white', whiteSpace: 'nowrap',
};

const mainTextStyle = { fontWeight: 'bold', fontSize: '1.2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' };
const subTextStyle = { fontSize: '0.9rem', color: '#ccc', marginTop: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' };