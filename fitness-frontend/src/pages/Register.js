import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    age: '', gender: '', weight: '', height: '', fitness_goal: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed. Username may already exist.');
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f0f4f8', padding: '20px'
    }}>
      <div className="card" style={{ width: '440px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Username *</label>
              <input placeholder="Username" onChange={update('username')} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Email</label>
              <input type="email" placeholder="Email" onChange={update('email')} />
            </div>
          </div>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Password *</label>
          <input type="password" placeholder="Min 6 characters" onChange={update('password')} required />
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Age</label>
              <input type="number" placeholder="Age" onChange={update('age')} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Gender</label>
              <select onChange={update('gender')}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Weight (kg)</label>
              <input type="number" placeholder="e.g. 65" onChange={update('weight')} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Height (cm)</label>
              <input type="number" placeholder="e.g. 165" onChange={update('height')} />
            </div>
          </div>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Fitness Goal</label>
          <select onChange={update('fitness_goal')}>
            <option value="">Select goal</option>
            <option value="lose_weight">Lose Weight</option>
            <option value="gain_muscle">Gain Muscle</option>
            <option value="maintain">Maintain Weight</option>
            <option value="improve_fitness">Improve Fitness</option>
          </select>
          <button type="submit" style={{ width: '100%', marginTop: '8px' }}>
            Create Account
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
          Already have an account? <Link to="/login" style={{ color: '#2d6a4f' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}