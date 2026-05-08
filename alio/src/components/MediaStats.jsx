import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export default function MediaStats({ type }) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pre-calculated statistics directly from the backend API
    fetch(`http://localhost:3000/api/media/statistics?type=${encodeURIComponent(type)}`)
      .then(res => res.json())
      .then(data => {
        setStatsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setLoading(false);
      });
  }, [type]); // Re-fetch whenever the type prop changes

  const lengthLabel = type === 'Movie' ? 'Minutes' : type === 'Book' ? 'Pages' : 'Seasons';
  const COLORS = ['#ff6b81', '#ffffff', '#cccccc', '#888888', '#444444'];
  const CHART_THEME = { backgroundColor: '#2b3035', border: 'none', borderRadius: '10px', color: 'white' };

  if (loading) return <div style={statsContainer}><h3 style={headerStyle}>Loading Stats...</h3></div>;

  if (!statsData || statsData.totalCount === 0) {
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
        <h1 style={{ margin: '0.5rem 0', fontSize: '3rem', color: '#ff6b81' }}>{statsData.totalCount}</h1>
      </div>

      {/* RATING CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Rating Distribution</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statsData.ratingStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
              {statsData.ratingStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={CHART_THEME} itemStyle={{ color: '#ff6b81' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RELEASE DECADES CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Release Eras</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statsData.decadeStats}>
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
          <BarChart data={statsData.lengthStats}>
            <Tooltip contentStyle={CHART_THEME} cursor={{fill: '#444'}} labelFormatter={(label, payload) => payload[0]?.payload.fullTitle || label} />
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
            <Pie data={statsData.genreStats} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="none">
              {statsData.genreStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={CHART_THEME} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- Inline Styles (Unchanged) ---
const statsContainer = { backgroundColor: '#343a40', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ff6b81 #2b3035' };
const headerStyle = { margin: '0 0 2rem 0', letterSpacing: '1px', borderBottom: '2px solid #555', paddingBottom: '1rem', width: '100%', textAlign: 'center' };
const statBox = { backgroundColor: '#2b3035', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', width: '100%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' };
const chartWrapper = { width: '100%', marginTop: '2.5rem' };
const chartTitle = { textAlign: 'center', color: '#ccc', margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'normal' };