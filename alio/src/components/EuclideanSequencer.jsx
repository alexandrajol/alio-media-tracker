import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { MediaContext } from '../context/MediaContext';
import { motion } from 'framer-motion';

// --- THE EUCLIDEAN ALGORITHM ---
const generateEuclidean = (pulses, steps) => {
  if (pulses === 0) return Array(steps).fill(false);
  const pattern = Array(steps).fill(false);
  for (let i = 0; i < pulses; i++) {
    pattern[Math.floor((i * steps) / pulses)] = true;
  }
  return pattern;
};

// --- NATIVE BROWSER AUDIO SYNTHESIS ---
let audioCtx;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = AudioContext ? new AudioContext() : null;
  }
  return audioCtx;
};

const playDrum = (type) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  
  if (type === 'kick') {
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'snare') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'hihat') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
};

export default function EuclideanSequencer() {
  const { mediaItems } = useContext(MediaContext);
  const items = Array.isArray(mediaItems) ? mediaItems : [];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 640;
  
  // --- DATA MAPPING LOGIC ---
  const STEPS = 16;
  const years = items.map((item) => item.year).filter(Boolean);
  const ratings = items.map((item) => item.rating).filter(Boolean);
  
  const avgYear = years.length ? Math.round(years.reduce((acc, year) => acc + year, 0) / years.length) : 2000;
  const kickPulses = (avgYear % STEPS) || 4; 
  
  const avgRating = ratings.length ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 3;
  const hatPulses = Math.max(1, Math.floor((avgRating / 5) * STEPS)); 

  const snarePulses = Math.max(1, (items.length % (STEPS / 2)));

  const kickPattern = useMemo(() => generateEuclidean(kickPulses, STEPS), [kickPulses]);
  const snarePattern = useMemo(() => generateEuclidean(snarePulses, STEPS), [snarePulses]);
  const hatPattern = useMemo(() => generateEuclidean(hatPulses, STEPS), [hatPulses]);

  // --- SEQUENCER STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // NEW: BPM State (Defaults to 100 BPM)
  const [bpm, setBpm] = useState(100); 

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stepRef = useRef(currentStep);
  stepRef.current = currentStep;

  // The Metronome
  useEffect(() => {
    let interval;
    if (isPlaying) {
      // MATH: Convert BPM to milliseconds per 16th note step
      // 60,000 ms in a minute / BPM = ms per quarter note. 
      // Divide by 4 again because we have 4 steps per quarter note.
      const msPerStep = 15000 / bpm; 

      interval = setInterval(() => {
        const nextStep = (stepRef.current + 1) % STEPS;
        setCurrentStep(nextStep);
        
        if (kickPattern[nextStep]) playDrum('kick');
        if (snarePattern[nextStep]) playDrum('snare');
        if (hatPattern[nextStep]) playDrum('hihat');
        
      }, msPerStep); 
    } else {
      setCurrentStep(0);
    }
    // Make sure bpm is in the dependency array so the interval updates if you slide it while playing!
    return () => clearInterval(interval);
  }, [isPlaying, kickPattern, snarePattern, hatPattern, bpm]); 

  if (!mediaItems) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading Sequencer Data...</div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ color: '#ccc', textAlign: 'center', marginTop: '2rem' }}>
        <em>Add some movies or books to see the Euclidean Sequencer activate!</em>
      </div>
    );
  }

  return (
    <div style={isMobile ? mobileContainerStyle : containerStyle}>
      <h2 style={isMobile ? mobileTitleStyle : titleStyle}>The Data Sequencer</h2>
      <p style={isMobile ? mobileSubtitleStyle : subtitleStyle}>Your media library translated into Euclidean rhythms.</p>

      {/* STATS DISPLAY */}
      <div style={isMobile ? mobileStatsContainer : statsContainer}>
        <div style={isMobile ? mobileStatBox : statBox}>Avg Year: {avgYear} <br/> <span style={{color: '#ff6b81'}}>({kickPulses} Kicks)</span></div>
        <div style={isMobile ? mobileStatBox : statBox}>Avg Rating: {avgRating.toFixed(1)} <br/> <span style={{color: '#ff6b81'}}>({hatPulses} Hats)</span></div>
        <div style={isMobile ? mobileStatBox : statBox}>Total Media: {items.length} <br/> <span style={{color: '#ff6b81'}}>({snarePulses} Snares)</span></div>
      </div>

      {/* SEQUENCER GRID */}
      <div style={isMobile ? mobileGridStyle : gridStyle}>
        <Track name="Kick" pattern={kickPattern} currentStep={currentStep} color="#ff6b81" isMobile={isMobile} />
        <Track name="Snare" pattern={snarePattern} currentStep={currentStep} color="#2ECC71" isMobile={isMobile} />
        <Track name="Hi-Hat" pattern={hatPattern} currentStep={currentStep} color="#5D9CEC" isMobile={isMobile} />
      </div>

      {/* CONTROLS SECTION */}
      <div style={controlsContainer}>
        {/* Play Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          style={{...(isMobile ? mobilePlayBtnStyle : playBtnStyle), backgroundColor: isPlaying ? '#555' : '#ff6b81'}}
        >
          {isPlaying ? 'STOP' : 'PLAY YOUR DATA'}
        </button>

        {/* BPM Slider */}
        <div style={isMobile ? mobileBpmContainer : bpmContainer}>
          <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>BPM: {bpm}</label>
          <input 
            type="range" 
            min="60" 
            max="200" 
            value={bpm} 
            onChange={(e) => setBpm(Number(e.target.value))} 
            style={sliderStyle}
          />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: A Single Track Row ---
const Track = ({ name, pattern, currentStep, color, isMobile }) => (
  <div style={isMobile ? mobileTrackStyle : trackStyle}>
    <div style={isMobile ? mobileTrackName : trackName}>{name}</div>
    <div style={isMobile ? mobileStepsContainer : stepsContainer}>
      {pattern.map((isActive, i) => (
        <motion.div
          key={i}
          animate={{
            scale: currentStep === i ? 1.2 : 1,
            opacity: currentStep === i ? 1 : 0.8
          }}
          style={{
            ...(isMobile ? mobileStepNode : stepNode),
            backgroundColor: isActive ? color : '#333',
            boxShadow: currentStep === i && isActive ? `0 0 15px ${color}` : 'none',
            border: currentStep === i ? '2px solid white' : '2px solid transparent'
          }}
        />
      ))}
    </div>
  </div>
);

// --- STYLES ---
const containerStyle = { padding: '2rem', backgroundColor: '#232223', borderRadius: '20px', color: 'white', maxWidth: '800px', margin: '2rem auto', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const mobileContainerStyle = { ...containerStyle, padding: '1rem', borderRadius: '14px', margin: '1.5rem auto', width: '100%', boxSizing: 'border-box' };
const titleStyle = { fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '900', letterSpacing: '2px' };
const mobileTitleStyle = { ...titleStyle, fontSize: '1.6rem' };
const subtitleStyle = { color: '#ccc', marginBottom: '2rem' };
const mobileSubtitleStyle = { ...subtitleStyle, marginBottom: '1.25rem', fontSize: '0.9rem' };
const statsContainer = { display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' };
const mobileStatsContainer = { display: 'grid', gridTemplateColumns: '1fr', gap: '0.7rem', marginBottom: '1rem' };
const statBox = { backgroundColor: '#343a40', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', minWidth: '120px' };
const mobileStatBox = { ...statBox, minWidth: 0, padding: '0.75rem', fontSize: '0.85rem' };
const gridStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '15px' };
const mobileGridStyle = { ...gridStyle, gap: '0.85rem', marginBottom: '1.5rem', padding: '0.8rem', borderRadius: '12px' };
const trackStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
const mobileTrackStyle = { display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', alignItems: 'center', gap: '0.35rem', width: '100%', minWidth: 0 };
const trackName = { width: '60px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right', color: '#888' };
const mobileTrackName = { ...trackName, width: '44px', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis' };
const stepsContainer = { display: 'flex', gap: '8px', flex: 1 };
const mobileStepsContainer = { display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))', gap: '2px', width: '100%', minWidth: 0, overflow: 'hidden', padding: '2px', boxSizing: 'border-box' };
const stepNode = { width: '25px', height: '25px', borderRadius: '5px', transition: 'background-color 0.2s' };
const mobileStepNode = { width: '100%', aspectRatio: '1 / 1', minWidth: 0, borderRadius: '3px', transition: 'background-color 0.2s', boxSizing: 'border-box' };
const controlsContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' };
const playBtnStyle = { border: 'none', color: 'white', padding: '1rem 3rem', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'background-color 0.3s' };
const mobilePlayBtnStyle = { ...playBtnStyle, width: '100%', padding: '0.85rem 1rem', fontSize: '1rem' };
const bpmContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '300px' };
const mobileBpmContainer = { ...bpmContainer, maxWidth: '100%' };
const sliderStyle = { width: '100%', cursor: 'pointer', accentColor: '#ff6b81' };
