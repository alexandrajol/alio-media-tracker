import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export default function MediaStats({ data, type }) {
  
  // --- 1. RATING DATA ---
  const ratingStats = useMemo(() => {
    const counts = { '5 Stars': 0, '4 Stars': 0, '3 Stars': 0, '2 Stars': 0, '1 Star': 0 };
    data.forEach(item => {
      if (item.rating === 5) counts['5 Stars']++;
      else if (item.rating === 4) counts['4 Stars']++;
      else if (item.rating === 3) counts['3 Stars']++;
      else if (item.rating === 2) counts['2 Stars']++;
      else if (item.rating === 1) counts['1 Star']++;
    });
    return Object.keys(counts).filter(key => counts[key] > 0).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  // --- 2. RELEASE YEAR (DECADES) DATA ---
  const decadeStats = useMemo(() => {
    const decades = {};
    data.forEach(item => {
      if (item.year) {
        // Rounds year down to the nearest decade (e.g., 1987 -> 1980s)
        const decade = Math.floor(item.year / 10) * 10 + 's';
        decades[decade] = (decades[decade] || 0) + 1;
      }
    });
    // Sort chronologically
    return Object.keys(decades).sort().map(key => ({ name: key, count: decades[key] }));
  }, [data]);

  // --- 3. GENRE DATA ---
  const genreStats = useMemo(() => {
    const genres = {};
    data.forEach(item => {
      const g = item.genre || 'Uncategorized'; // Default if genre is missing
      genres[g] = (genres[g] || 0) + 1;
    });
    return Object.keys(genres).map(key => ({ name: key, value: genres[key] }));
  }, [data]);

  // --- 4. LENGTH DATA (Minutes, Pages, or Seasons) ---
  const lengthStats = useMemo(() => {
    return data.map(item => {
      let lengthVal = 0;
      if (type === 'Movie' && item.duration) {
        // Parse "1h 40m" into raw minutes (100)
        const hMatch = item.duration.match(/(\d+)h/);
        const mMatch = item.duration.match(/(\d+)m/);
        if (hMatch) lengthVal += parseInt(hMatch[1]) * 60;
        if (mMatch) lengthVal += parseInt(mMatch[1]);
      } else if (type === 'Book' && item.pages) {
        lengthVal = item.pages;
      } else if (type === 'TV Show' && item.seasons) {
        lengthVal = item.seasons;
      }
      return { 
        name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title, 
        length: lengthVal,
        fullTitle: item.title
      };
    });
  }, [data, type]);

  // Determine the label for the length chart based on the type
  const lengthLabel = type === 'Movie' ? 'Minutes' : type === 'Book' ? 'Pages' : 'Seasons';

  // Aesthetic Colors
  const COLORS = ['#ff6b81', '#ffffff', '#cccccc', '#888888', '#444444'];
  const CHART_THEME = { backgroundColor: '#2b3035', border: 'none', borderRadius: '10px', color: 'white' };

  if (!data || data.length === 0) {
    return (
      <div style={statsContainer}>
        <h3 style={headerStyle}>{type} Statistics</h3>
        <p style={{ color: '#ccc' }}>Add some data to see your stats!</p>
      </div>
    );
  }

  return (
    <div style={statsContainer}>
      <h3 style={headerStyle}>{type} Insights</h3>
      
      {/* Total Count Widget */}
      <div style={statBox}>
        <h4 style={{ margin: 0, color: '#ccc' }}>Total {type}s</h4>
        <h1 style={{ margin: '0.5rem 0', fontSize: '3rem', color: '#ff6b81' }}>{data.length}</h1>
      </div>

      {/* RATING CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Rating Distribution</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={ratingStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
              {ratingStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={CHART_THEME} itemStyle={{ color: '#ff6b81' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RELEASE DECADES CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Release Eras</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={decadeStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
            <XAxis dataKey="name" stroke="#ccc" fontSize={12} tickLine={false} />
            <YAxis stroke="#ccc" fontSize={12} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={CHART_THEME} cursor={{fill: '#444'}} />
            <Bar dataKey="count" fill="#ff6b81" radius={[4, 4, 0, 0]} name={`Number of ${type}s`} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LENGTH COMPARISON CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Length Comparison ({lengthLabel})</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={lengthStats}>
            <Tooltip contentStyle={CHART_THEME} cursor={{fill: '#444'}} labelFormatter={(label, payload) => payload[0]?.payload.fullTitle || label} />
            {/* Hidden XAxis because movie titles are too long to fit nicely */}
            <XAxis dataKey="name" hide /> 
            <Bar dataKey="length" fill="#ffffff" radius={[2, 2, 0, 0]} name={lengthLabel} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* GENRE CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Genres</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={genreStats} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="none">
              {genreStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={CHART_THEME} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// --- Inline Styles ---
const statsContainer = {
  backgroundColor: '#343a40',
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // Because we added so many charts, we need to make this panel scrollable!
  maxHeight: 'calc(100vh - 120px)', 
  overflowY: 'auto',
  scrollbarWidth: 'thin', // Firefox
  scrollbarColor: '#ff6b81 #2b3035',
};

const headerStyle = { margin: '0 0 2rem 0', letterSpacing: '1px', borderBottom: '2px solid #555', paddingBottom: '1rem', width: '100%', textAlign: 'center' };
const statBox = { backgroundColor: '#2b3035', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', width: '100%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' };
const chartWrapper = { width: '100%', marginTop: '2.5rem' };
const chartTitle = { textAlign: 'center', color: '#ccc', margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'normal' };