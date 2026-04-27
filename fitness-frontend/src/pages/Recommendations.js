import { useState } from 'react';
import { getRecommendations, getBMIHistory, getActivities } from '../services/api';

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setMsg('');
    try {
      // Check if user has BMI and activity data first
      const [bmiRes, actRes] = await Promise.all([getBMIHistory(), getActivities()]);
      if (bmiRes.data.length === 0) {
        setMsg('⚠️ Please calculate your BMI first before generating recommendations!');
        setLoading(false);
        return;
      }
      if (actRes.data.length === 0) {
        setMsg('⚠️ Please log at least one activity before generating recommendations!');
        setLoading(false);
        return;
      }
      const res = await getRecommendations();
      setData(res.data);
    } catch {
      setMsg('Error generating recommendations. Please try again.');
    }
    setLoading(false);
  };

  const levelColors = {
    sedentary: '#ffe0e0', lightly_active: '#fff3cd',
    moderately_active: '#d8f3dc', highly_active: '#cce5ff'
  };

  return (
    <div>
      <h2>AI Recommendations</h2>
      <div className="card">
        <h3>Get Your Personalized AI Plan</h3>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
          Our AI analyzes your activity history, BMI, and goals to generate a personalized workout and nutrition plan.
        </p>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
          ℹ️ Make sure you have logged at least one activity and calculated your BMI first.
        </p>
        {msg && <div className="alert error">{msg}</div>}
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Analyzing your data...' : '🤖 Generate My Recommendations'}
        </button>
      </div>

      {data && (
        <>
          <div className="card" style={{ background: levelColors[data.activity_level] || '#f0f4f8' }}>
            <h3>Your Activity Level</h3>
            <div style={{ fontSize: '24px', fontWeight: 700, textTransform: 'capitalize', color: '#2d6a4f' }}>
              {data.activity_level?.replace('_', ' ')}
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3>🏋️ Workout Recommendation</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                {data.workout_recommendation}
              </p>
              <h3>Suggested Workouts</h3>
              {data.suggested_workouts?.map((w, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: '#f0f4f8',
                  borderRadius: '8px', marginBottom: '8px', fontSize: '14px',
                  borderLeft: '4px solid #2d6a4f'
                }}>{w}</div>
              ))}
            </div>
            <div className="card">
              <h3>🥗 Nutrition Advice</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                {data.nutrition_advice}
              </p>
              <div style={{
                padding: '20px', background: '#d8f3dc',
                borderRadius: '10px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#2d6a4f' }}>
                  {data.daily_calorie_target}
                </div>
                <div style={{ fontSize: '14px', color: '#1b4332' }}>Daily Calorie Target (kcal)</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}