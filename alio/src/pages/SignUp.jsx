import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// We can reuse the styles we just exported from Login!
import { pageContainer, cardStyle, formStyle, inputGroup, labelStyle, inputStyle, submitBtnStyle, linkStyle } from './Login';

export default function SignUp() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Simulate creating an account and logging them in instantly
    login();
    navigate('/');
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

          <div style={inputGroup}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
          </div>

          <button type="submit" style={submitBtnStyle}>Sign Up</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={linkStyle}>Already have an account? Go to Log In!</Link>
        </div>
      </div>
    </div>
  );
}