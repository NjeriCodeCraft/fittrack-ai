import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActivityLog from './pages/ActivityLog';
import Nutrition from './pages/Nutrition';
import BMICalculator from './pages/BMICalculator';
import Goals from './pages/Goals';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import './App.css';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <ActivityLog />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/nutrition" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Nutrition />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/bmi" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <BMICalculator />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Goals />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Recommendations />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Reports />
              </div>
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;