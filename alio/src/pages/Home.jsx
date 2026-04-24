import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// The data for your 3 Accordion Cards! 
const OPTIONS = [
  {
    id: 'books',
    title: 'Books',
    sub: 'Track your reading universe',
    icon: '📚', // We can use emojis as quick icons, or FontAwesome later!
    bg: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'shows',
    title: 'TV Shows',
    sub: 'Binge-watch tracking',
    icon: '📺',
    bg: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'movies',
    title: 'Movies',
    sub: 'Your personal cinema',
    icon: '🎬',
    bg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Home() {
  const navigate = useNavigate();
  // We track which card is currently expanded. Default is 'movies'.
  const [activeCard, setActiveCard] = useState('movies');

  return (
    <div style={pageContainer}>
      
      {/* ALIO Title Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={titleContainer}
      >
        <h1 style={logoStyle}>ALIO</h1> 
        <h2 style={taglineStyle}>Track your entertainment universe.</h2>
      </motion.div>

      {/* THE ACCORDION FLEX CARDS */}
      <div style={accordionContainer}>
        {OPTIONS.map((option) => {
          const isActive = activeCard === option.id;

          return (
            <motion.div
              key={option.id}
              // This acts exactly like the jQuery hover/click from the CodePen
              onHoverStart={() => setActiveCard(option.id)}
              onClick={() => navigate(`/${option.id}`)}
              // Framer Motion automatically handles the flex-grow transition!
              animate={{
                flexGrow: isActive ? 10 : 1,
                margin: isActive ? '0px' : '10px',
                borderRadius: isActive ? '40px' : '30px',
                minWidth: isActive ? '300px' : '60px',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{
                ...cardStyle,
                backgroundImage: `url(${option.bg})`,
              }}
            >
              {/* Bottom shadow fade for text readability */}
              <div style={shadowOverlay} />

              {/* The Label & Icon Area */}
              <motion.div 
                animate={{
                  bottom: isActive ? '20px' : '10px',
                  left: isActive ? '20px' : '10px',
                }}
                style={labelContainer}
              >
                <div style={iconCircle}>{option.icon}</div>
                
                {/* The text info that slides in and out */}
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

    </div>
  );
}

// --- Inline CSS Objects replicating the CodePen SCSS ---
const pageContainer = { padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' };
const titleContainer = { textAlign: 'center', marginBottom: '3rem' };
const logoStyle = { fontSize: '4rem', margin: '0 0 0.5rem 0', letterSpacing: '4px', fontWeight: '900', color: 'white' };
const taglineStyle = { color: '#ff6b81', margin: 0, fontStyle: 'italic', fontSize: '1.2rem' };

const accordionContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '900px',
  height: '400px', // Exact height from CodePen
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
  bottom: 0,
  left: 0,
  right: 0,
  height: '120px',
  // Replicates the inset bottom shadow from the CodePen
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
};

const labelContainer = {
  display: 'flex',
  position: 'absolute',
  height: '40px',
  alignItems: 'center',
};

const iconCircle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '40px',
  maxWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'white',
  color: '#333',
  fontSize: '1.2rem',
};

const infoContainer = {
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '15px',
  color: 'white',
  whiteSpace: 'nowrap',
};

const mainTextStyle = { fontWeight: 'bold', fontSize: '1.2rem', color: 'white' };
const subTextStyle = { fontSize: '0.9rem', color: '#ccc', marginTop: '2px' };