import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#2d6a4f', padding: '0 24px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '60px'
    }}>
      <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>
        🏃 FitTrack AI
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/activities', label: 'Activities' },
          { to: '/nutrition', label: 'Nutrition' },
          { to: '/bmi', label: 'BMI' },
          { to: '/goals', label: 'Goals' },
          { to: '/recommendations', label: 'AI Recs' },
          { to: '/reports', label: 'Reports' },
        ].map(link => (
          <Link key={link.to} to={link.to} style={{
            color: 'white', textDecoration: 'none',
            padding: '6px 12px', borderRadius: '6px',
            fontSize: '13px', fontWeight: '500'
          }}
            onMouseOver={e => e.target.style.background = '#1b4332'}
            onMouseOut={e => e.target.style.background = 'transparent'}
          >{link.label}</Link>
        ))}
        <button onClick={handleLogout} style={{
          background: '#e63946', padding: '6px 14px',
          fontSize: '13px', borderRadius: '6px'
        }}>Logout</button>
      </div>
    </nav>
  );
}
