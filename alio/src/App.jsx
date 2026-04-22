import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies'; // <-- Import the new page
import Books from './pages/Books';
import TVShows from './pages/TVShows';
import MovieDetails from './pages/MovieDetails';
import MediaForm from './pages/MediaForm';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} /> 
          <Route path="/books" element={<Books />} /> 
          <Route path="/tvshows" element={<TVShows />} /> 

          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/books/:id" element={<MovieDetails />} />
          <Route path="/tvshows/:id" element={<MovieDetails />} />

          <Route path="/add" element={<MediaForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;