import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Books from './pages/Books';
import Shows from './pages/TVShows';
import MovieDetails from './pages/MovieDetails';
import MediaForm from './pages/MediaForm';
// New imports!
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  // Hide the navbar on the login and signup pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      
      <div style={{ padding: '2rem' }}>
        <Routes>
          {/* Public Routes (Anyone can see these) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes (Must be logged in to see these!) */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/shows" element={<ProtectedRoute><Shows /></ProtectedRoute>} />
          
          <Route path="/movies/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/shows/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          
          <Route path="/add" element={<ProtectedRoute><MediaForm /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><MediaForm /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;