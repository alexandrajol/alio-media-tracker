import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would validate the credentials here. 
    // For now, any click logs them in!
    login();
    navigate('/'); // Send them to the Home page after login
  };

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
          </div>

          <button type="submit" style={submitBtnStyle}>Log In</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/signup" style={linkStyle}>Don't have an account? Create one!</Link>
          <br/>
          <Link to="#" style={linkStyle}>Forgot your password? Bad Luck!</Link>
        </div>
      </div>
    </div>
  );
}

// --- Shared Styles matching your Figma ---
export const pageContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' };
export const cardStyle = { backgroundColor: '#343a40', padding: '4rem 3rem', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 0 50px rgba(255, 255, 255, 0.05)' };
export const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
export const inputGroup = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
export const labelStyle = { fontSize: '0.9rem', color: '#ccc' };
export const inputStyle = { padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8f9fa', color: '#333', fontSize: '1rem' };
export const submitBtnStyle = { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '1rem', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' };
export const linkStyle = { color: '#ff6b81', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' };