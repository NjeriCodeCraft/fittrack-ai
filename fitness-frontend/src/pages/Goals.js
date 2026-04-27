import { useEffect, useState } from 'react';
import { getGoals, addGoal, deleteGoal, updateGoal } from '../services/api';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ goal_type: 'weight', target_value: '', deadline: '' });
  const [msg, setMsg] = useState('');

  const load = () => getGoals().then(r => setGoals(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGoal(form);
      setMsg('Goal added!');
      setForm({ goal_type: 'weight', target_value: '', deadline: '' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error adding goal.'); }
  };

  const toggleAchieved = async (goal) => {
    await updateGoal(goal.id, { achieved: !goal.achieved });
    load();
  };

  return (
    <div>
      <h2>Goal Setting</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Set a New Goal</h3>
          {msg && <div className="alert success">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Goal Type</label>
            <select value={form.goal_type} onChange={e => setForm({ ...form, goal_type: e.target.value })}>
              <option value="weight">Target Weight (kg)</option>
              <option value="activity">Weekly Activity (days/week)</option>
              <option value="calories">Daily Calorie Target (kcal)</option>
            </select>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Target Value</label>
            <input type="number" placeholder="e.g. 60" value={form.target_value}
              onChange={e => setForm({ ...form, target_value: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Deadline (optional)</label>
            <input type="date" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <button type="submit" style={{ width: '100%' }}>Add Goal</button>
          </form>
        </div>
        <div className="card">
          <h3>My Goals</h3>
          {goals.length === 0
            ? <p style={{ color: '#888', fontSize: '14px' }}>No goals set yet.</p>
            : goals.map(g => (
              <div key={g.id} style={{
                padding: '14px', borderRadius: '8px', marginBottom: '10px',
                background: g.achieved ? '#d8f3dc' : '#f8f9fa',
                border: `1px solid ${g.achieved ? '#74c69d' : '#eee'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>
                    {g.goal_type.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    Target: {g.target_value} {g.deadline && `| Deadline: ${g.deadline}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="secondary" onClick={() => toggleAchieved(g)}
                    style={{ padding: '4px 10px', fontSize: '12px' }}>
                    {g.achieved ? '✅ Done' : 'Mark Done'}
                  </button>
                  <button className="danger" onClick={() => deleteGoal(g.id).then(load)}
                    style={{ padding: '4px 10px', fontSize: '12px' }}>Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}