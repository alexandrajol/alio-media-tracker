import React, { useContext, useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';

export default function MediaStats({ type }) {
  const { token } = useContext(AuthContext);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);

  useEffect(() => {
    if (!token) return;

    // Fetch pre-calculated statistics directly from the backend API
    fetch(`${API_BASE_URL}/media/statistics?type=${encodeURIComponent(type)}`, {
      headers: getAuthHeaders(token),
    })
      .then(res => res.json())
      .then(data => {
        setStatsData({
          ...data,
          ratingStats: Array.isArray(data.ratingStats) ? data.ratingStats : [],
          decadeStats: Array.isArray(data.decadeStats) ? data.decadeStats : [],
          statusStats: Array.isArray(data.statusStats) ? data.statusStats : [],
          genreStats: Array.isArray(data.genreStats) ? data.genreStats : [],
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setLoading(false);
      });
  }, [type, token]); // Re-fetch whenever the type prop changes

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const COLORS = ['#ff6b81', '#ffffff', '#cccccc', '#888888', '#444444'];
  const CHART_THEME = { backgroundColor: '#2b3035', border: 'none', borderRadius: '10px', color: 'white' };

  const containerStyle = isMobile ? mobileStatsContainer : statsContainer;

  if (loading) return <div style={containerStyle}><h3 style={headerStyle}>Loading Stats...</h3></div>;

  if (!statsData || statsData.totalCount === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={headerStyle}>{type} Statistics</h3>
        <p style={{ color: '#ccc' }}>Add some data to see your stats!</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>{type} Insights</h3>
      
      {/* Total Count Widget */}
      <div style={statBox}>
        <h4 style={{ margin: 0, color: '#ccc' }}>Total {type}s</h4>
        <h1 style={{ margin: '0.5rem 0', fontSize: '3rem', color: '#ff6b81' }}>{statsData.totalCount}</h1>
      </div>

      {/* RATING CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Rating Distribution</h4>
        <div style={chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statsData.ratingStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                {statsData.ratingStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={CHART_THEME} itemStyle={{ color: '#ff6b81' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RELEASE DECADES CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Release Eras</h4>
        <div style={chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData.decadeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="name" stroke="#ccc" fontSize={12} tickLine={false} />
              <YAxis stroke="#ccc" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={CHART_THEME} cursor={{fill: '#444'}} />
              <Bar dataKey="count" fill="#ff6b81" radius={[4, 4, 0, 0]} name={`Number of ${type}s`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATUS BREAKDOWN CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Status Breakdown</h4>
        <div style={chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statsData.statusStats} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                {statsData.statusStats.map((entry, index) => <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={CHART_THEME} itemStyle={{ color: '#ff6b81' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GENRE CHART */}
      <div style={chartWrapper}>
        <h4 style={chartTitle}>Genres</h4>
        <div style={chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statsData.genreStats} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="none">
                {statsData.genreStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={CHART_THEME} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// --- Inline Styles (Unchanged) ---
const statsContainer = { backgroundColor: '#343a40', borderRadius: '20px', padding: '2rem', paddingRight: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: 'calc(100vh - 140px)', maxHeight: '720px', minHeight: '360px', overflowX: 'hidden', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y', scrollbarWidth: 'thin', scrollbarColor: '#ff6b81 #2b3035', width: '100%', minWidth: 0, boxSizing: 'border-box' };
const mobileStatsContainer = { ...statsContainer, height: 'auto', maxHeight: 'none', minHeight: 0, overflowY: 'visible', padding: '1.25rem' };
const headerStyle = { margin: '0 0 2rem 0', letterSpacing: '1px', borderBottom: '2px solid #555', paddingBottom: '1rem', width: '100%', maxWidth: '100%', textAlign: 'center', boxSizing: 'border-box' };
const statBox = { backgroundColor: '#2b3035', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', width: '100%', maxWidth: '100%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)', boxSizing: 'border-box' };
const chartWrapper = { width: '100%', maxWidth: '100%', minWidth: 0, marginTop: '2.5rem', overflow: 'hidden', flex: '0 0 auto' };
const chartArea = { width: '100%', height: '200px', minHeight: '200px', minWidth: 0 };
const chartTitle = { textAlign: 'center', color: '#ccc', margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'normal' };
