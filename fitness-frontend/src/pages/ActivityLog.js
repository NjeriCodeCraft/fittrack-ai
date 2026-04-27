import { useEffect, useState } from 'react';
import { getActivities, addActivity, deleteActivity } from '../services/api';

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    exercise_type: 'running', duration: '', intensity: 'moderate', date: '', notes: ''
  });
  const [msg, setMsg] = useState('');

  const load = () => getActivities().then(r => setActivities(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity(form);
      setMsg('Activity logged successfully!');
      setForm({ exercise_type: 'running', duration: '', intensity: 'moderate', date: '', notes: '' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error logging activity.'); }
  };

  const handleDelete = async (id) => {
    await deleteActivity(id);
    load();
  };

  return (
    <div>
      <h2>Activity Log</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Log New Activity</h3>
          {msg && <div className="alert success">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Exercise Type</label>
            <select value={form.exercise_type} onChange={e => setForm({ ...form, exercise_type: e.target.value })}>
              {['running','walking','cycling','swimming','weightlifting','yoga','hiit','other'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Duration (minutes)</label>
            <input type="number" placeholder="e.g. 30" value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Intensity</label>
            <select value={form.intensity} onChange={e => setForm({ ...form, intensity: e.target.value })}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Notes (optional)</label>
            <input placeholder="Any notes..." value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
            <button type="submit" style={{ width: '100%' }}>Log Activity</button>
          </form>
        </div>
        <div className="card">
          <h3>Recent Activities</h3>
          {activities.length === 0
            ? <p style={{ color: '#888', fontSize: '14px' }}>No activities logged yet.</p>
            : <table>
              <thead><tr><th>Exercise</th><th>Duration</th><th>Calories</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {activities.map(a => (
                  <tr key={a.id}>
                    <td>{a.exercise_type}</td>
                    <td>{a.duration} min</td>
                    <td>{Math.round(a.calories_burned)} kcal</td>
                    <td>{a.date}</td>
                    <td><button className="danger" onClick={() => handleDelete(a.id)} style={{ padding: '4px 10px', fontSize: '12px' }}>Delete</button></td>
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