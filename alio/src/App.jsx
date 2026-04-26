import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Books from './pages/Books';
import Shows from './pages/TVShows';
import MovieDetails from './pages/MovieDetails';
import MediaForm from './pages/MediaForm';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  // --- TELEMETRY TRACKER (SILVER CHALLENGE) ---
  // --- TELEMETRY TRACKER (SILVER CHALLENGE) ---
  useEffect(() => {
    if (hideNavbar) return;

    // 1. TRACK ACTIVITY (Total Clicks)
    let currentVisits = Cookies.get('alio_total_clicks');
    currentVisits = currentVisits ? parseInt(currentVisits) : 0;
    Cookies.set('alio_total_clicks', currentVisits + 1, { expires: 7 });
    Cookies.set('alio_last_page', location.pathname, { expires: 7 });

    // 2. TRACK PREFERENCE (Favorite Media)
    const path = location.pathname;
    if (path === '/movies' || path === '/books' || path === '/tvshows') {
      
      // Get the existing preferences cookie, or create a fresh one
      const rawPrefs = Cookies.get('alio_preferences');
      const preferences = rawPrefs ? JSON.parse(rawPrefs) : { movies: 0, books: 0, tvshow: 0 };

      // Add a point to the category they just visited
      const category = path.replace('/', ''); // turns "/movies" into "movies"
      preferences[category] += 1;

      // Save it back to the cookie
      Cookies.set('alio_preferences', JSON.stringify(preferences), { expires: 7 });
    }

  }, [location.pathname]);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/tvshows" element={<ProtectedRoute><Shows /></ProtectedRoute>} />
          
          <Route path="/movies/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/tvshows/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          
          <Route path="/add" element={<ProtectedRoute><MediaForm /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><MediaForm /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;