import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// We can reuse the styles we just exported from Login!
import { pageContainer, cardStyle, formStyle, inputGroup, labelStyle, inputStyle, submitBtnStyle, linkStyle, errorStyle } from './Login';

export default function SignUp() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={inputGroup}>
            <label htmlFor="signup-email" style={labelStyle}>Email</label>
            <input id="signup-email" type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroup}>
            <label htmlFor="signup-username" style={labelStyle}>Username</label>
            <input id="signup-username" name="username" value={formData.username} onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroup}>
            <label htmlFor="signup-password" style={labelStyle}>Password</label>
            <input id="signup-password" type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroup}>
            <label htmlFor="signup-confirm-password" style={labelStyle}>Confirm Password</label>
            <input id="signup-confirm-password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
          </div>

          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={linkStyle}>Already have an account? Go to Log In!</Link>
        </div>
      </div>
    </div>
  );
}
