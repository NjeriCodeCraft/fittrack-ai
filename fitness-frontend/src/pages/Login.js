import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login(res.data.access);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f0f4f8'
    }}>
      <div className="card" style={{ width: '380px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>🏃 FitTrack AI</h2>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome back!</h3>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Username</label>
          <input
            type="text" placeholder="Enter your username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Password</label>
          <input
            type="password" placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" style={{ width: '100%', marginTop: '8px' }}>
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2d6a4f' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
