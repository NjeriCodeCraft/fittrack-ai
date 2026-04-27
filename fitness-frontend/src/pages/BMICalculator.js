import { useEffect, useState } from 'react';
import { calculateBMI, getBMIHistory } from '../services/api';

export default function BMICalculator() {
  const [form, setForm] = useState({ weight: '', height: '' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => getBMIHistory().then(r => setHistory(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await calculateBMI(form);
      setResult(res.data);
      load();
    } catch { setMsg('Error calculating BMI.'); }
  };

  const categoryColor = {
    underweight: '#cce5ff', normal: '#d8f3dc',
    overweight: '#fff3cd', obese: '#ffe0e0'
  };

  return (
    <div>
      <h2>BMI Calculator</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Calculate Your BMI</h3>
          {msg && <div className="alert error">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Weight (kg)</label>
            <input type="number" placeholder="e.g. 65" value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Height (cm)</label>
            <input type="number" placeholder="e.g. 165" value={form.height}
              onChange={e => setForm({ ...form, height: e.target.value })} required />
            <button type="submit" style={{ width: '100%' }}>Calculate BMI</button>
          </form>
          {result && (
            <div style={{
              marginTop: '20px', padding: '20px', borderRadius: '10px', textAlign: 'center',
              background: categoryColor[result.category] || '#f0f4f8'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 700, color: '#2d6a4f' }}>{result.bmi_value}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', textTransform: 'capitalize' }}>{result.category}</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>
                Underweight &lt;18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥30
              </div>
            </div>
          )}
        </div>
        <div className="card">
          <h3>BMI History</h3>
          {history.length === 0
            ? <p style={{ color: '#888', fontSize: '14px' }}>No BMI records yet.</p>
            : <table>
              <thead><tr><th>BMI</th><th>Category</th><th>Weight</th><th>Height</th><th>Date</th></tr></thead>
              <tbody>
                {history.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.bmi_value}</strong></td>
                    <td><span className={`badge ${b.category}`}>{b.category}</span></td>
                    <td>{b.weight} kg</td>
                    <td>{b.height} cm</td>
                    <td>{b.date}</td>
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