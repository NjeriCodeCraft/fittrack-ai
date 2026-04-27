import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
        padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: '22px' }}>🏃 FitTrack AI</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1.5px solid white',
            color: 'white', padding: '8px 20px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 600, fontSize: '14px'
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            background: '#2d6a4f', border: 'none',
            color: 'white', padding: '8px 20px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 600, fontSize: '14px'
          }}>Get Started</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 40%, #40916c 100%)',
        display: 'flex', alignItems: 'center',
        padding: '80px 60px 40px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background circles decoration */}
        <div style={{
          position: 'absolute', right: '-100px', top: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', right: '100px', bottom: '-150px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            
            {/* LEFT TEXT */}
            <div>
              <div style={{
                display: 'inline-block', background: 'rgba(255,255,255,0.15)',
                color: 'white', padding: '6px 16px', borderRadius: '20px',
                fontSize: '13px', fontWeight: 600, marginBottom: '24px'
              }}>
                🤖 Powered by Artificial Intelligence
              </div>
              <h1 style={{
                color: 'white', fontSize: '52px', fontWeight: 800,
                lineHeight: 1.15, marginBottom: '20px'
              }}>
                Your Smart<br />
                <span style={{ color: '#74c69d' }}>Health & Fitness</span><br />
                Companion
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.85)', fontSize: '17px',
                lineHeight: 1.7, marginBottom: '36px', maxWidth: '440px'
              }}>
                Track your workouts, monitor nutrition, calculate BMI, and get personalized AI-powered fitness recommendations — all in one place.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/register')} style={{
                  background: '#74c69d', color: '#1b4332', border: 'none',
                  padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
                  fontWeight: 700, cursor: 'pointer'
                }}>
                  Start For Free →
                </button>
                <button onClick={() => navigate('/login')} style={{
                  background: 'transparent', color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
                  fontWeight: 600, cursor: 'pointer'
                }}>
                  Login
                </button>
              </div>
            </div>

            {/* RIGHT — STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: '🏃', label: 'Activity Tracking', desc: 'Log workouts & calories burned automatically' },
                { icon: '🥗', label: 'Nutrition Monitor', desc: 'Track meals, calories, protein & macros' },
                { icon: '⚖️', label: 'BMI Analysis', desc: 'Instant BMI with WHO health classification' },
                { icon: '🤖', label: 'AI Recommendations', desc: 'Personalized plans from your data' },
              ].map((f, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px', padding: '24px',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{f.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{f.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: '#1b4332', padding: '40px 60px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px', textAlign: 'center'
        }}>
          {[
            { num: '500+', label: 'AI Training Data Points' },
            { num: '8', label: 'Exercise Categories Tracked' },
            { num: '87%', label: 'AI Model Accuracy' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ color: '#74c69d', fontSize: '40px', fontWeight: 800 }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: '#f0f4f8', padding: '80px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#1b4332', marginBottom: '8px' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px', fontSize: '16px' }}>
            Three simple steps to a healthier you
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and enter your age, weight, height, and fitness goals to personalize your experience.' },
              { step: '02', title: 'Log Your Data', desc: 'Track your daily workouts, meals, and calculate your BMI regularly to build your health history.' },
              { step: '03', title: 'Get AI Insights', desc: 'Our AI analyzes your data and delivers personalized workout and nutrition recommendations just for you.' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '16px',
                padding: '32px 24px', textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#2d6a4f', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800, margin: '0 auto 20px'
                }}>{s.step}</div>
                <h3 style={{ color: '#1b4332', marginBottom: '12px', fontSize: '18px' }}>{s.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #2d6a4f, #1b4332)',
        padding: '80px 60px', textAlign: 'center'
      }}>
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Ready to Transform Your Health?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
          Join FitTrack AI today and start your journey to a healthier lifestyle.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#74c69d', color: '#1b4332', border: 'none',
          padding: '16px 40px', borderRadius: '12px',
          fontSize: '18px', fontWeight: 700, cursor: 'pointer'
        }}>
          Get Started Free →
        </button>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#0d2b1d', padding: '24px 60px',
        textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px'
      }}>
        © 2026 FitTrack AI — Design and Development of an AI-Based Health and Fitness Tracking System
      </div>
    </div>
  );
}