import { useEffect, useState } from 'react';
import { getActivities, getNutritionSummary, getBMIHistory, getRecommendations } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [nutrition, setNutrition] = useState({});
  const [bmi, setBmi] = useState(null);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getActivities(), getNutritionSummary(),
      getBMIHistory(), getRecommendations()
    ]).then(([a, n, b, r]) => {
      setActivities(a.data.slice(0, 7));
      setNutrition(n.data);
      setBmi(b.data[0] || null);
      setRec(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;

  const activityChartData = {
    labels: activities.map(a => a.date).reverse(),
    datasets: [{
      label: 'Calories Burned',
      data: activities.map(a => a.calories_burned).reverse(),
      borderColor: '#2d6a4f',
      backgroundColor: 'rgba(45,106,79,0.1)',
      tension: 0.4, fill: true,
    }]
  };

  const nutritionChartData = {
    labels: ['Calories', 'Protein (g)', 'Carbs (g)', 'Fats (g)'],
    datasets: [{
      label: "Today's Nutrition",
      data: [
        nutrition.total_calories || 0,
        nutrition.total_protein || 0,
        nutrition.total_carbs || 0,
        nutrition.total_fats || 0,
      ],
      backgroundColor: ['#2d6a4f', '#40916c', '#74c69d', '#b7e4c7'],
    }]
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="number">{activities.length}</div>
          <div className="label">Activities This Week</div>
        </div>
        <div className="stat-card">
          <div className="number">{Math.round(nutrition.total_calories || 0)}</div>
          <div className="label">Calories Today</div>
        </div>
        <div className="stat-card">
          <div className="number">{bmi ? bmi.bmi_value : '—'}</div>
          <div className="label">Current BMI {bmi && <span className={`badge ${bmi.category}`}>{bmi.category}</span>}</div>
        </div>
      </div>

      {rec && (
        <div className="card" style={{ background: '#d8f3dc', border: '1px solid #74c69d' }}>
          <h3>🤖 AI Recommendation</h3>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Activity Level:</strong> {rec.activity_level?.replace('_', ' ')}
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>{rec.workout_recommendation}</p>
          <p style={{ fontSize: '14px', color: '#1b4332' }}><strong>Nutrition:</strong> {rec.nutrition_advice}</p>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h3>Activity Progress</h3>
          {activities.length > 0
            ? <Line data={activityChartData} options={{ responsive: true }} />
            : <p style={{ color: '#888', fontSize: '14px' }}>No activity data yet. Log your first workout!</p>
          }
        </div>
        <div className="card">
          <h3>Today's Nutrition</h3>
          <Bar data={nutritionChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}