import { useEffect, useState } from 'react';
import { getNutrition, addNutrition, deleteNutrition, getNutritionSummary } from '../services/api';

export default function Nutrition() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState({
    food_item: '', meal_type: 'breakfast',
    calories: '', protein: '', carbohydrates: '', fats: '', date: ''
  });
  const [msg, setMsg] = useState('');

  const load = () => {
    getNutrition().then(r => setLogs(r.data));
    getNutritionSummary().then(r => setSummary(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNutrition(form);
      setMsg('Meal logged!');
      setForm({ food_item: '', meal_type: 'breakfast', calories: '', protein: '', carbohydrates: '', fats: '', date: '' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error logging meal.'); }
  };

  return (
    <div>
      <h2>Nutrition Tracker</h2>
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        <div className="stat-card"><div className="number">{Math.round(summary.total_calories || 0)}</div><div className="label">Calories Today</div></div>
        <div className="stat-card"><div className="number">{Math.round(summary.total_protein || 0)}g</div><div className="label">Protein</div></div>
        <div className="stat-card"><div className="number">{Math.round(summary.total_carbs || 0)}g</div><div className="label">Carbohydrates</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h3>Log a Meal</h3>
          {msg && <div className="alert success">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Food Item</label>
            <input placeholder="e.g. Ugali with beef" value={form.food_item}
              onChange={e => setForm({ ...form, food_item: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Meal Type</label>
            <select value={form.meal_type} onChange={e => setForm({ ...form, meal_type: e.target.value })}>
              {['breakfast','lunch','dinner','snack'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Calories</label>
                <input type="number" placeholder="kcal" value={form.calories}
                  onChange={e => setForm({ ...form, calories: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Protein (g)</label>
                <input type="number" placeholder="g" value={form.protein}
                  onChange={e => setForm({ ...form, protein: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Carbs (g)</label>
                <input type="number" placeholder="g" value={form.carbohydrates}
                  onChange={e => setForm({ ...form, carbohydrates: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Fats (g)</label>
                <input type="number" placeholder="g" value={form.fats}
                  onChange={e => setForm({ ...form, fats: e.target.value })} />
              </div>
            </div>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} required />
            <button type="submit" style={{ width: '100%' }}>Log Meal</button>
          </form>
        </div>
        <div className="card">
          <h3>Recent Meals</h3>
          {logs.length === 0
            ? <p style={{ color: '#888', fontSize: '14px' }}>No meals logged yet.</p>
            : <table>
              <thead><tr><th>Food</th><th>Meal</th><th>Calories</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id}>
                    <td>{l.food_item}</td>
                    <td>{l.meal_type}</td>
                    <td>{l.calories} kcal</td>
                    <td>{l.date}</td>
                    <td><button className="danger" onClick={() => deleteNutrition(l.id).then(load)} style={{ padding: '4px 10px', fontSize: '12px' }}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  );
}