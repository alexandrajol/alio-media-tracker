import React, { useContext, useState, useEffect, useRef } from 'react';
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
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playDrum = (type) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  
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
  
  // --- DATA MAPPING LOGIC ---
  const STEPS = 16;
  
  const avgYear = mediaItems.length ? Math.round(mediaItems.reduce((acc, curr) => acc + (curr.year || 0), 0) / mediaItems.length) : 2000;
  const kickPulses = (avgYear % STEPS) || 4; 
  
  const avgRating = mediaItems.length ? mediaItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / mediaItems.length : 3;
  const hatPulses = Math.max(1, Math.floor((avgRating / 5) * STEPS)); 

  const snarePulses = Math.max(1, (mediaItems.length % (STEPS / 2)));

  const kickPattern = generateEuclidean(kickPulses, STEPS);
  const snarePattern = generateEuclidean(snarePulses, STEPS);
  const hatPattern = generateEuclidean(hatPulses, STEPS);

  // --- SEQUENCER STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // NEW: BPM State (Defaults to 100 BPM)
  const [bpm, setBpm] = useState(100); 

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

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>The Data Sequencer</h2>
      <p style={subtitleStyle}>Your media library translated into Euclidean rhythms.</p>

      {/* STATS DISPLAY */}
      <div style={statsContainer}>
        <div style={statBox}>Avg Year: {avgYear} <br/> <span style={{color: '#ff6b81'}}>({kickPulses} Kicks)</span></div>
        <div style={statBox}>Avg Rating: {avgRating.toFixed(1)} <br/> <span style={{color: '#ff6b81'}}>({hatPulses} Hats)</span></div>
        <div style={statBox}>Total Media: {mediaItems.length} <br/> <span style={{color: '#ff6b81'}}>({snarePulses} Snares)</span></div>
      </div>

      {/* SEQUENCER GRID */}
      <div style={gridStyle}>
        <Track name="Kick" pattern={kickPattern} currentStep={currentStep} color="#ff6b81" />
        <Track name="Snare" pattern={snarePattern} currentStep={currentStep} color="#2ECC71" />
        <Track name="Hi-Hat" pattern={hatPattern} currentStep={currentStep} color="#5D9CEC" />
      </div>

      {/* CONTROLS SECTION */}
      <div style={controlsContainer}>
        {/* Play Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          style={{...playBtnStyle, backgroundColor: isPlaying ? '#555' : '#ff6b81'}}
        >
          {isPlaying ? '■ STOP' : '▶ PLAY YOUR DATA'}
        </button>

        {/* BPM Slider */}
        <div style={bpmContainer}>
          <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>BPM: {bpm}</label>
          <input 
            type="range" 
            min="60" 
            max="200" 
            value={bpm} 
            onChange={(e) => setBpm(e.target.value)} 
            style={sliderStyle}
          />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: A Single Track Row ---
const Track = ({ name, pattern, currentStep, color }) => (
  <div style={trackStyle}>
    <div style={trackName}>{name}</div>
    <div style={stepsContainer}>
      {pattern.map((isActive, i) => (
        <motion.div
          key={i}
          animate={{
            scale: currentStep === i ? 1.2 : 1,
            opacity: currentStep === i ? 1 : 0.8
          }}
          style={{
            ...stepNode,
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
const titleStyle = { fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '900', letterSpacing: '2px' };
const subtitleStyle = { color: '#ccc', marginBottom: '2rem' };
const statsContainer = { display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' };
const statBox = { backgroundColor: '#343a40', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', minWidth: '120px' };
const gridStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '15px' };
const trackStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
const trackName = { width: '60px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right', color: '#888' };
const stepsContainer = { display: 'flex', gap: '8px', flex: 1 };
const stepNode = { width: '25px', height: '25px', borderRadius: '5px', transition: 'background-color 0.2s' };
const controlsContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' };
const playBtnStyle = { border: 'none', color: 'white', padding: '1rem 3rem', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'background-color 0.3s' };
const bpmContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '300px' };
const sliderStyle = { width: '100%', cursor: 'pointer', accentColor: '#ff6b81' };